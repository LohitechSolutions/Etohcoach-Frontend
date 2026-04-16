/**
 * M3 — Rails catalogue → Firestore ETL (parallel run / staging mirror).
 *
 * Rollback: keep app reading REST (do not set CONTENT_SOURCE / EXPO_PUBLIC_CONTENT_SOURCE to firestore).
 *
 * Usage (from firebase/etl):
 *   npm install && npm run migrate -- [--dry-run]
 *
 * Env: see env.example (RAILS_API_BASE_URL, GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_JSON, optional RAILS_AUTH_TOKEN).
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import admin from 'firebase-admin';
import type { DocumentReference } from 'firebase-admin/firestore';

type PublishStatus = 'draft' | 'published';
type CourseCategory = 'attract' | 'convince' | 'convert';

function loadDotenv(): void {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return;
  const text = readFileSync(envPath, 'utf8');
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq <= 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

function asRecord(x: unknown): Record<string, unknown> {
  return x !== null && typeof x === 'object' && !Array.isArray(x) ? (x as Record<string, unknown>) : {};
}

function normalizeDataArray(raw: unknown): unknown[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw;
  const r = asRecord(raw);
  if (Array.isArray(r['data'])) return r['data'] as unknown[];
  return [];
}

/** Rails often wraps lists as `{ data: [...] }`. */
function normalizeEmbeddedList(raw: unknown): unknown[] {
  const direct = normalizeDataArray(raw);
  if (direct.length) return direct;
  return normalizeDataArray(asRecord(raw)['data']);
}

function str(x: unknown, fallback = ''): string {
  return typeof x === 'string' ? x : x != null ? String(x) : fallback;
}

function railsAttr(item: unknown): Record<string, unknown> {
  const r = asRecord(item);
  const a = r['attributes'];
  return asRecord(a);
}

function extractOptionFields(attr: Record<string, unknown>): string[] {
  const keys = Object.keys(attr)
    .filter((k) => /^option_/i.test(k))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const out: string[] = [];
  for (const k of keys) {
    const v = attr[k];
    if (typeof v === 'string' && v.trim()) out.push(v.trim());
  }
  return out;
}

function mapThemeToCategory(theme: unknown, themeIndex: number): CourseCategory {
  const raw = process.env['ETL_THEME_CATEGORY_JSON'];
  if (raw) {
    try {
      const map = JSON.parse(raw) as Record<string, string>;
      const tid = str(asRecord(theme)['id'] || railsAttr(theme)['id']);
      const c = map[tid]?.toLowerCase();
      if (c === 'attract' || c === 'convince' || c === 'convert') return c;
    } catch {
      /* ignore */
    }
  }
  const ta = railsAttr(theme);
  const name = str(ta['name'] ?? ta['title'] ?? asRecord(theme)['name']).toLowerCase();
  if (name.includes('convince')) return 'convince';
  if (name.includes('convert')) return 'convert';
  if (name.includes('attract')) return 'attract';
  const cycle: CourseCategory[] = ['attract', 'convince', 'convert'];
  return cycle[themeIndex % 3]!;
}

function initFirebase(): void {
  const json = process.env['FIREBASE_SERVICE_ACCOUNT_JSON'];
  if (json) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(json)) });
    return;
  }
  if (process.env['GOOGLE_APPLICATION_CREDENTIALS']) {
    admin.initializeApp();
    return;
  }
  throw new Error(
    'Set GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON) or FIREBASE_SERVICE_ACCOUNT_JSON.',
  );
}

function railsHeaders(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = process.env['RAILS_AUTH_TOKEN'];
  if (token) h['token'] = token;
  return h;
}

async function railsFetch(method: string, path: string, body?: unknown): Promise<unknown> {
  const base = (process.env['RAILS_API_BASE_URL'] || '').replace(/\/$/, '');
  if (!base) throw new Error('RAILS_API_BASE_URL is required');
  const url = `${base}/${path.replace(/^\/+/, '')}`;
  const throttle = Number(process.env['ETL_THROTTLE_MS'] || '0') || 0;
  if (throttle > 0) await new Promise((r) => setTimeout(r, throttle));
  const res = await fetch(url, {
    method,
    headers: railsHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 500)}`);
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Non-JSON response for ${path}: ${text.slice(0, 200)}`);
  }
}

function courseDocId(courseRailsId: string, themeRailsId: string): string {
  return `etohl_c_${courseRailsId}_t_${themeRailsId}`;
}

function lessonDocId(lessonRailsId: string): string {
  return `etohl_l_${lessonRailsId}`;
}

function publishStatus(): PublishStatus {
  const d = (process.env['ETL_IMPORT_AS_DRAFT'] || '').toLowerCase();
  return d === 'true' || d === '1' ? 'draft' : 'published';
}

function mapQuizFromRails(
  q: unknown,
  lessonFirestoreId: string,
  lessonStatus: PublishStatus,
  order: number,
): Record<string, unknown> | null {
  const item = asRecord(q);
  const attr = { ...railsAttr(q), ...item };
  const qType = str(attr['question_type']).toLowerCase();
  if (!qType || (qType !== 'multiple_choice' && qType !== 'radio_button')) {
    return null;
  }
  const questionText = str(attr['question'] ?? attr['name']).trim() || '(Untitled question)';
  const options = extractOptionFields(attr);
  if (options.length < 2) return null;

  let correct_index = 0;
  const isCorrect = attr['is_correct'];
  if (Array.isArray(isCorrect) && isCorrect.length > 0) {
    const target = str(isCorrect[0]).trim();
    const idx = options.findIndex((o) => o.trim() === target);
    correct_index = idx >= 0 ? idx : 0;
  }

  const imageUrl = str(attr['image_url'] ?? attr['image']).trim();

  const out: Record<string, unknown> = {
    lesson_id: lessonFirestoreId,
    lesson_status: lessonStatus,
    question: questionText,
    options,
    correct_index,
    order,
  };
  if (imageUrl) out['image_url'] = imageUrl;
  return out;
}

function mapFlashFromRails(
  fc: unknown,
  lessonFirestoreId: string,
  lessonStatus: PublishStatus,
  order: number,
): Record<string, unknown> {
  const item = asRecord(fc);
  const attr = { ...railsAttr(fc), ...item };
  const text =
    str(attr['question'] ?? attr['text'] ?? attr['front'] ?? attr['title']).trim() || '(Flashcard)';
  const imageUrl = str(attr['image_url'] ?? attr['image']).trim();
  const out: Record<string, unknown> = {
    lesson_id: lessonFirestoreId,
    lesson_status: lessonStatus,
    text,
    order,
  };
  if (imageUrl) out['image_url'] = imageUrl;
  return out;
}

async function fetchLessonShow(lessonRailsId: string, lessonType: string): Promise<Record<string, unknown>> {
  try {
    const path = `lesson/show?id=${encodeURIComponent(lessonRailsId)}&type=${encodeURIComponent(lessonType)}`;
    const json = (await railsFetch('POST', path)) as Record<string, unknown>;
    const data = json['data'];
    if (Array.isArray(data) && data[0]) return asRecord(data[0]);
    if (data && typeof data === 'object') return asRecord(data);
    return {};
  } catch {
    return {};
  }
}

type WriteOp = { ref: DocumentReference; data: Record<string, unknown> };

async function commitInChunks(db: admin.firestore.Firestore, ops: WriteOp[]): Promise<void> {
  const max = 400;
  for (let i = 0; i < ops.length; i += max) {
    const batch = db.batch();
    for (const op of ops.slice(i, i + max)) {
      batch.set(op.ref, op.data, { merge: true });
    }
    await batch.commit();
  }
}

async function fetchQuizQuestionsForTheme(themeRailsId: string): Promise<unknown[]> {
  try {
    const path = `bx_block_quiz_and_mock_exams/quiz_and_mock_exam/get_answer_list?exam_type=${encodeURIComponent('Quiz Exam')}&theme_id=${encodeURIComponent(themeRailsId)}`;
    const json = (await railsFetch('GET', path)) as Record<string, unknown>;
    return normalizeDataArray(json['data']);
  } catch {
    return [];
  }
}

async function main(): Promise<void> {
  loadDotenv();
  const dryRun = process.argv.includes('--dry-run');

  const importStatus = publishStatus();
  initFirebase();
  const db = admin.firestore();

  console.log(`ETL: RAILS_API_BASE_URL=${process.env['RAILS_API_BASE_URL']}`);
  console.log(`ETL: import status=${importStatus}${dryRun ? ' (dry-run)' : ''}`);

  const catalogueJson = (await railsFetch('GET', 'catalogue/catalogues')) as Record<string, unknown>;
  const coursesRaw = normalizeDataArray(catalogueJson['data']);
  if (coursesRaw.length === 0) {
    console.warn('No courses in catalogue/catalogues — check API auth or response shape.');
  }

  const allOps: WriteOp[] = [];
  let courseCount = 0;
  let lessonCount = 0;
  let flashCount = 0;
  let quizCount = 0;
  let skippedQuizTypes = 0;

  let globalCourseOrder = 0;

  for (const courseItem of coursesRaw) {
    const cr = railsAttr(courseItem);
    const courseRailsId = str(asRecord(courseItem)['id'] ?? cr['id']);
    if (!courseRailsId) continue;

    const courseName = str(cr['name'] ?? cr['title'] ?? 'Course');

    let themesRaw: unknown[] = [];
    try {
      const themesJson = (await railsFetch(
        'GET',
        `themes/list?course_id=${encodeURIComponent(courseRailsId)}&status=complete`,
      )) as Record<string, unknown>;
      themesRaw = normalizeDataArray(themesJson['data']);
    } catch {
      try {
        const themesJson = (await railsFetch(
          'GET',
          `themes/list?course_id=${encodeURIComponent(courseRailsId)}`,
        )) as Record<string, unknown>;
        themesRaw = normalizeDataArray(themesJson['data']);
      } catch {
        themesRaw = [];
      }
    }

    if (themesRaw.length === 0) {
      console.warn(`No themes for course ${courseRailsId} (${courseName}) — skipping (needs themes/list).`);
      continue;
    }

    themesRaw.sort((a, b) => {
      const ida = Number(str(asRecord(a)['id'] ?? railsAttr(a)['id'], '0'));
      const idb = Number(str(asRecord(b)['id'] ?? railsAttr(b)['id'], '0'));
      return ida - idb;
    });

    let themeIndex = 0;
    for (const themeItem of themesRaw) {
      const tr = railsAttr(themeItem);
      const themeRailsId = str(asRecord(themeItem)['id'] ?? tr['id']);
      if (!themeRailsId) {
        themeIndex++;
        continue;
      }

      const themeName = str(tr['name'] ?? tr['title'] ?? 'Theme');
      const category = mapThemeToCategory(themeItem, themeIndex);
      const fireCourseId = courseDocId(courseRailsId, themeRailsId);

      const courseDoc: Record<string, unknown> = {
        title: `${courseName} — ${themeName}`,
        short_description: str(cr['short_description'] ?? cr['description'] ?? '').slice(0, 2000) || undefined,
        full_description: str(cr['description'] ?? cr['full_description'] ?? '') || undefined,
        category,
        language: str(cr['language'] ?? 'en') || 'en',
        cover_image_url: str(cr['cover_image_url'] ?? cr['image_url'] ?? cr['image']).trim() || undefined,
        status: importStatus,
        order: globalCourseOrder++,
      };
      Object.keys(courseDoc).forEach((k) => courseDoc[k] === undefined && delete courseDoc[k]);

      allOps.push({ ref: db.collection('courses').doc(fireCourseId), data: courseDoc });
      courseCount++;

      let bundle: Record<string, unknown> = {};
      try {
        bundle = (await railsFetch(
          'GET',
          `lessons/list?theme_id=${encodeURIComponent(themeRailsId)}`,
        )) as Record<string, unknown>;
      } catch (e) {
        console.warn(`lessons/list theme ${themeRailsId}: ${e instanceof Error ? e.message : e}`);
        themeIndex++;
        continue;
      }

      const lessonsNode = bundle['lessons'];
      let lessonsData = normalizeDataArray(lessonsNode);
      if (lessonsData.length === 0 && lessonsNode && typeof lessonsNode === 'object') {
        lessonsData = normalizeDataArray(asRecord(lessonsNode)['data']);
      }
      const flashRaw = normalizeEmbeddedList(bundle['flash_cards']);
      const quizMetaRaw = normalizeEmbeddedList(bundle['quiz_exams']);

      const quizDetailList = await fetchQuizQuestionsForTheme(themeRailsId);

      lessonsData.sort((a, b) => {
        const aa = railsAttr(a);
        const ba = railsAttr(b);
        const oa = Number(str(aa['order_no'] ?? aa['lesson_index'] ?? 0));
        const ob = Number(str(ba['order_no'] ?? ba['lesson_index'] ?? 0));
        return oa - ob;
      });

      let lessonOrder = 0;
      let lastLessonFirestoreId: string | null = null;

      for (const lessonItem of lessonsData) {
        const lr = railsAttr(lessonItem);
        const lessonRailsId = str(asRecord(lessonItem)['id'] ?? lr['id']);
        if (!lessonRailsId) continue;

        const lessonType = str(asRecord(lessonItem)['type'] ?? lr['lesson_type'] ?? 'lesson');
        const detail = await fetchLessonShow(lessonRailsId, lessonType);
        const dr = { ...lr, ...detail, ...railsAttr(detail) };

        const fireLessonId = lessonDocId(lessonRailsId);
        lastLessonFirestoreId = fireLessonId;

        const lessonDoc: Record<string, unknown> = {
          course_id: fireCourseId,
          title: str(dr['name'] ?? dr['title'] ?? 'Lesson'),
          short_description: str(dr['short_description'] ?? dr['description'] ?? '').slice(0, 2000) || undefined,
          scenario: str(dr['scenario'] ?? dr['situation'] ?? '') || undefined,
          language: str(dr['language'] ?? cr['language'] ?? 'en') || 'en',
          video_url: str(dr['video_url'] ?? dr['video'] ?? '').trim() || undefined,
          image_url: str(dr['image_url'] ?? dr['image'] ?? '').trim() || undefined,
          status: importStatus,
          order: lessonOrder++,
        };
        Object.keys(lessonDoc).forEach((k) => lessonDoc[k] === undefined && delete lessonDoc[k]);

        allOps.push({ ref: db.collection('lessons').doc(fireLessonId), data: lessonDoc });
        lessonCount++;
      }

      /**
       * Rails exposes theme-level flash decks & quiz exams; the mobile app runs them after the lesson list.
       * Map them onto the last lesson in the theme so Firestore’s per-lesson model stays valid for publish rules.
       */
      const attachLessonId = lastLessonFirestoreId;
      if (attachLessonId) {
        let themeFlash = flashRaw.filter((f) => {
          const fa = railsAttr(f);
          return str(fa['theme_id']) === themeRailsId || str(asRecord(f)['theme_id']) === themeRailsId;
        });
        if (themeFlash.length === 0 && flashRaw.length > 0) {
          themeFlash = flashRaw;
        }

        let fo = 0;
        for (const f of themeFlash) {
          const fr = asRecord(f);
          const fid = str(fr['id'] ?? railsAttr(f)['id'], `idx_${fo}`);
          const data = mapFlashFromRails(f, attachLessonId, importStatus, fo++);
          allOps.push({ ref: db.collection('flashcards').doc(`etohl_fc_${fid}`), data });
          flashCount++;
        }

        const questionsForLesson: unknown[] = quizDetailList.length ? quizDetailList : quizMetaRaw;
        let qo = 0;
        for (const q of questionsForLesson) {
          const attr = { ...railsAttr(q), ...asRecord(q) };
          const qType = str(attr['question_type']).toLowerCase();
          if (qType && qType !== 'multiple_choice' && qType !== 'radio_button') {
            skippedQuizTypes++;
            continue;
          }
          const qr = asRecord(q);
          const qid = str(qr['id'] ?? railsAttr(q)['id'], `q_${qo}`);
          const mapped = mapQuizFromRails(q, attachLessonId, importStatus, qo);
          if (!mapped) {
            skippedQuizTypes++;
            continue;
          }
          allOps.push({ ref: db.collection('quiz_questions').doc(`etohl_qq_${qid}`), data: mapped });
          quizCount++;
          qo++;
        }
      } else if (flashRaw.length || quizDetailList.length || quizMetaRaw.length) {
        console.warn(
          `Theme ${themeRailsId}: flashcards/quiz present but no lessons — skipped attaching (${themeName}).`,
        );
      }

      themeIndex++;
    }
  }

  console.log(
    JSON.stringify(
      { courses: courseCount, lessons: lessonCount, flashcards: flashCount, quiz_questions: quizCount, skippedQuizTypes },
      null,
      2,
    ),
  );

  if (dryRun) {
    console.log('Dry-run: no Firestore writes.');
    return;
  }

  await commitInChunks(db, allOps);
  console.log('ETL complete.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
