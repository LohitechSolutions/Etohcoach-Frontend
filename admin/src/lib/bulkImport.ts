import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  collection,
  doc,
  writeBatch,
  type Firestore,
} from 'firebase/firestore';
import type { CourseCategory, CourseDoc, FlashcardDoc, LessonDoc, QuizQuestionDoc } from '@schema';

const BATCH_MAX = 400;

const CATEGORIES: CourseCategory[] = ['attract', 'convince', 'convert'];

export type NormalizedRow = Record<string, string>;

export type NumberedRow = { line: number; row: NormalizedRow };

function str(v: unknown): string {
  if (v == null) return '';
  return String(v).trim();
}

/** Lowercase keys, trim key names and values (handles Excel/CSV quirks). */
export function normalizeRowKeys(raw: Record<string, unknown>): NormalizedRow {
  const out: NormalizedRow = {};
  for (const [k, v] of Object.entries(raw)) {
    const key = k.trim().toLowerCase();
    if (!key) continue;
    out[key] = str(v);
  }
  return out;
}

function parseStatus(raw: string, fallback: 'draft' | 'published'): 'draft' | 'published' {
  const s = raw.toLowerCase();
  if (s === 'published') return 'published';
  if (s === 'draft' || s === '') return fallback;
  throw new Error(`Invalid status "${raw}" (use draft or published)`);
}

function flashIndicesFromRow(row: NormalizedRow): number[] {
  const set = new Set<number>();
  for (const key of Object.keys(row)) {
    const m = /^flashcard_(\d+)$/.exec(key);
    if (m) set.add(Number(m[1]));
  }
  return [...set].sort((a, b) => a - b);
}

function questionIndicesFromRow(row: NormalizedRow): number[] {
  const set = new Set<number>();
  for (const key of Object.keys(row)) {
    const m = /^question_(\d+)$/.exec(key);
    if (m) set.add(Number(m[1]));
  }
  return [...set].sort((a, b) => a - b);
}

function optionKeysForQuestion(qn: number, row: NormalizedRow): string[] {
  const prefix = `q${qn}_option_`;
  return Object.keys(row)
    .filter((k) => k.startsWith(prefix))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function letterToIndex(letter: string, optionCount: number): number | null {
  const c = letter.trim().toLowerCase();
  if (!/^[a-z]$/.test(c)) return null;
  const idx = c.charCodeAt(0) - 'a'.charCodeAt(0);
  if (idx < 0 || idx >= optionCount) return null;
  return idx;
}

function parseCategory(raw: string): CourseCategory {
  const c = raw.toLowerCase() as CourseCategory;
  if (!CATEGORIES.includes(c)) {
    throw new Error(`category must be one of: ${CATEGORIES.join(', ')}`);
  }
  return c;
}

export function parseCsvText(text: string): NumberedRow[] {
  const parsed = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (h) => h.trim(),
  });
  if (parsed.errors.length) {
    const msg = parsed.errors.map((e) => e.message).join('; ');
    throw new Error(`CSV parse error: ${msg}`);
  }
  const rows: NumberedRow[] = [];
  parsed.data.forEach((raw, i) => {
    const row = normalizeRowKeys(raw);
    const hasAny = Object.values(row).some((v) => v.length > 0);
    if (!hasAny) return;
    rows.push({ line: i + 2, row });
  });
  return rows;
}

export function parseXlsxArrayBuffer(buf: ArrayBuffer): NumberedRow[] {
  const wb = XLSX.read(buf, { type: 'array' });
  const name = wb.SheetNames[0];
  if (!name) throw new Error('Workbook has no sheets');
  const sheet = wb.Sheets[name];
  if (!sheet) throw new Error('First sheet is missing');
  const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
  const rows: NumberedRow[] = [];
  json.forEach((raw, i) => {
    const row = normalizeRowKeys(raw);
    const hasAny = Object.values(row).some((v) => v.length > 0);
    if (!hasAny) return;
    rows.push({ line: i + 2, row });
  });
  return rows;
}

export type BulkImportValidationError = { line: number; message: string };

export function validateAndBuildOps(
  db: Firestore,
  numbered: NumberedRow[],
): { ok: true; ops: BatchOp[]; summary: BulkImportSummary } | { ok: false; errors: BulkImportValidationError[] } {
  const errors: BulkImportValidationError[] = [];

  if (numbered.length === 0) {
    return { ok: false, errors: [{ line: 0, message: 'No data rows found.' }] };
  }

  type CoursePlan = { refId: string; doc: CourseDoc };
  const courseByKey = new Map<string, CoursePlan>();

  type LessonPlan = {
    refId: string;
    doc: LessonDoc;
    line: number;
    flashcards: Omit<FlashcardDoc, 'lesson_id' | 'order'>[];
    quizzes: Omit<QuizQuestionDoc, 'lesson_id' | 'order'>[];
  };
  const lessons: LessonPlan[] = [];

  for (const { line, row } of numbered) {
    try {
      const courseTitle = row['course_title'];
      const lessonTitle = row['lesson_title'];
      const language = row['language'];

      if (!courseTitle) {
        errors.push({ line, message: 'Missing course_title.' });
        continue;
      }
      if (!lessonTitle) {
        errors.push({ line, message: 'Missing lesson_title.' });
        continue;
      }
      if (!language) {
        errors.push({ line, message: 'Missing language.' });
        continue;
      }

      let category: CourseCategory;
      try {
        category = parseCategory(row['category'] || '');
      } catch (e) {
        errors.push({
          line,
          message: e instanceof Error ? e.message : 'Invalid category.',
        });
        continue;
      }

      let courseStatus: 'draft' | 'published';
      let lessonStatus: 'draft' | 'published';
      try {
        courseStatus = parseStatus(row['course_status'] || '', 'draft');
        lessonStatus = parseStatus(row['lesson_status'] || '', 'draft');
      } catch (e) {
        errors.push({
          line,
          message: e instanceof Error ? e.message : 'Invalid status.',
        });
        continue;
      }

      const orderRaw = row['course_order'];
      const courseOrder = orderRaw === '' ? 0 : Number(orderRaw);
      if (!Number.isFinite(courseOrder)) {
        errors.push({ line, message: `Invalid course_order: "${orderRaw}"` });
        continue;
      }

      const courseKey = `${courseTitle}\0${language}`;
      if (courseByKey.has(courseKey)) {
        const existing = courseByKey.get(courseKey)!;
        if (existing.doc.category !== category) {
          errors.push({
            line,
            message: `category conflicts with an earlier row for this course (expected ${existing.doc.category}).`,
          });
          continue;
        }
        if (existing.doc.status !== courseStatus) {
          errors.push({
            line,
            message: `course_status conflicts with an earlier row for this course (expected ${existing.doc.status}).`,
          });
          continue;
        }
        if (existing.doc.order !== courseOrder) {
          errors.push({
            line,
            message: `course_order conflicts with an earlier row for this course (expected ${existing.doc.order}).`,
          });
          continue;
        }
      }

      if (!courseByKey.has(courseKey)) {
        const ref = doc(collection(db, 'courses'));

        const cDoc: CourseDoc = {
          title: courseTitle,
          category,
          language,
          status: courseStatus,
          order: courseOrder,
        };
        const sd = row['course_short_description'];
        const fd = row['course_full_description'];
        const cov = row['course_cover_image_url'];
        const m = row['moment'];
        const sit = row['situation'];
        const sk = row['skill'];
        if (sd) cDoc.short_description = sd;
        if (fd) cDoc.full_description = fd;
        if (cov) cDoc.cover_image_url = cov;
        if (m) cDoc.moment = m;
        if (sit) cDoc.situation = sit;
        if (sk) cDoc.skill = sk;

        courseByKey.set(courseKey, { refId: ref.id, doc: cDoc });
      }

      const coursePlan = courseByKey.get(courseKey)!;
      const courseId = coursePlan.refId;

      const lessonRef = doc(collection(db, 'lessons'));
      const loRaw = row['lesson_order'];
      const lessonOrder = loRaw === '' ? 0 : Number(loRaw);
      if (!Number.isFinite(lessonOrder)) {
        errors.push({ line, message: `Invalid lesson_order: "${loRaw}"` });
        continue;
      }

      const lessonLang = row['lesson_language'] || language;
      const lDoc: LessonDoc = {
        course_id: courseId,
        title: lessonTitle,
        language: lessonLang,
        status: lessonStatus,
        order: lessonOrder,
      };
      const lsd = row['short_description'];
      const sc = row['scenario'];
      const vu = row['video_url'];
      const iu = row['image_url'];
      if (lsd) lDoc.short_description = lsd;
      if (sc) lDoc.scenario = sc;
      if (vu) lDoc.video_url = vu;
      if (iu) lDoc.image_url = iu;

      const fIdx = flashIndicesFromRow(row);
      const flashBodies: Omit<FlashcardDoc, 'lesson_id' | 'order'>[] = [];
      for (const fi of fIdx) {
        const text = row[`flashcard_${fi}`] || '';
        const imgKey = `flashcard_image_${fi}`;
        const imageUrl = row[imgKey] || '';
        if (!text) continue;
        flashBodies.push({
          lesson_status: lessonStatus,
          text,
          ...(imageUrl ? { image_url: imageUrl } : {}),
        });
      }

      const qIdx = questionIndicesFromRow(row);
      const quizBodies: Omit<QuizQuestionDoc, 'lesson_id' | 'order'>[] = [];
      let quizRowFailed = false;
      for (const qi of qIdx) {
        const qtext = row[`question_${qi}`] || '';
        if (!qtext) continue;
        const optKeys = optionKeysForQuestion(qi, row);
        const options: string[] = [];
        for (const ok of optKeys) {
          const v = row[ok] || '';
          if (v) options.push(v);
        }
        const correctRaw = row[`q${qi}_correct`] || '';
        const correctIdx = letterToIndex(correctRaw, options.length);
        if (options.length < 2) {
          errors.push({
            line,
            message: `question_${qi} needs at least two non-empty options (${optKeys.join(', ')}).`,
          });
          quizRowFailed = true;
          break;
        }
        if (correctIdx === null) {
          errors.push({
            line,
            message: `question_${qi}: q${qi}_correct must be a letter a–z matching a filled option (got "${correctRaw}").`,
          });
          quizRowFailed = true;
          break;
        }
        const imgUrl = row[`q${qi}_image_url`] || '';
        quizBodies.push({
          lesson_status: lessonStatus,
          question: qtext,
          options,
          correct_index: correctIdx,
          ...(imgUrl ? { image_url: imgUrl } : {}),
        });
      }
      if (quizRowFailed) {
        continue;
      }

      if (flashBodies.length < 1) {
        errors.push({ line, message: 'Each row needs at least one non-empty flashcard_N.' });
        continue;
      }
      if (quizBodies.length < 1) {
        errors.push({ line, message: 'Each row needs at least one valid question_N with options.' });
        continue;
      }

      if (lessonStatus === 'published') {
        let pubInvalid = false;
        for (const q of quizBodies) {
          if (q.options.length < 2 || q.correct_index < 0 || q.correct_index >= q.options.length) {
            errors.push({
              line,
              message: 'Published lessons require each quiz to have ≥2 options and a valid correct answer.',
            });
            pubInvalid = true;
            break;
          }
        }
        if (pubInvalid) {
          continue;
        }
      }

      lessons.push({
        refId: lessonRef.id,
        doc: lDoc,
        line,
        flashcards: flashBodies,
        quizzes: quizBodies,
      });
    } catch (e) {
      errors.push({
        line,
        message: e instanceof Error ? e.message : 'Validation error.',
      });
    }
  }

  if (errors.length === 0 && lessons.length === 0) {
    return {
      ok: false,
      errors: [{ line: 0, message: 'No valid rows to import (check required columns and flashcards/quiz).' }],
    };
  }

  if (errors.length) {
    return { ok: false, errors };
  }

  const usedCourseIds = new Set(lessons.map((L) => L.doc.course_id));

  const ops: BatchOp[] = [];
  for (const c of courseByKey.values()) {
    if (!usedCourseIds.has(c.refId)) {
      continue;
    }
    ops.push({ coll: 'courses', id: c.refId, data: { ...c.doc } });
  }
  for (const L of lessons) {
    ops.push({ coll: 'lessons', id: L.refId, data: { ...L.doc } });
    const ls = L.doc.status;
    let fo = 0;
    for (const f of L.flashcards) {
      const fr = doc(collection(db, 'flashcards'));
      const flash: FlashcardDoc = {
        lesson_id: L.refId,
        lesson_status: ls,
        text: f.text,
        order: fo++,
        ...(f.image_url ? { image_url: f.image_url } : {}),
      };
      ops.push({ coll: 'flashcards', id: fr.id, data: { ...flash } as Record<string, unknown> });
    }
    let qo = 0;
    for (const q of L.quizzes) {
      const qr = doc(collection(db, 'quiz_questions'));
      const quiz: QuizQuestionDoc = {
        lesson_id: L.refId,
        lesson_status: ls,
        question: q.question,
        options: q.options,
        correct_index: q.correct_index,
        order: qo++,
        ...(q.image_url ? { image_url: q.image_url } : {}),
      };
      ops.push({ coll: 'quiz_questions', id: qr.id, data: { ...quiz } as Record<string, unknown> });
    }
  }

  const summary: BulkImportSummary = {
    courses: courseByKey.size,
    lessons: lessons.length,
    flashcards: lessons.reduce((n, L) => n + L.flashcards.length, 0),
    quizQuestions: lessons.reduce((n, L) => n + L.quizzes.length, 0),
  };

  return { ok: true, ops, summary };
}

export type BatchOp = {
  coll: string;
  id: string;
  data: Record<string, unknown>;
};

export type BulkImportSummary = {
  courses: number;
  lessons: number;
  flashcards: number;
  quizQuestions: number;
};

export async function commitBulkImportOps(db: Firestore, ops: BatchOp[]): Promise<void> {
  for (let i = 0; i < ops.length; i += BATCH_MAX) {
    const slice = ops.slice(i, i + BATCH_MAX);
    const batch = writeBatch(db);
    for (const op of slice) {
      batch.set(doc(db, op.coll, op.id), op.data);
    }
    await batch.commit();
  }
}

export async function runBulkImport(
  db: Firestore,
  numbered: NumberedRow[],
): Promise<
  | { ok: true; summary: BulkImportSummary }
  | { ok: false; errors: BulkImportValidationError[] }
> {
  const built = validateAndBuildOps(db, numbered);
  if (!built.ok) return built;
  await commitBulkImportOps(db, built.ops);
  return { ok: true, summary: built.summary };
}
