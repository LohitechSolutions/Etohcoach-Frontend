/**
 * M4 — read-only catalogue from Firestore (published content only).
 * Shapes mirror Rails JSON responses enough for existing catalogue blocks.
 */

import type { DocumentData } from 'firebase/firestore';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { getClientFirestore } from './firebaseClient';

function mapCategoryToDrinkType(category: unknown): string {
  const c = String(category || '').toLowerCase();
  if (c === 'convince') return 'Beer';
  if (c === 'convert') return 'Spirits';
  return 'Wine';
}

async function listPublishedLessonsForCourse(courseId: string) {
  const db = getClientFirestore();
  const q = query(
    collection(db, 'lessons'),
    where('course_id', '==', courseId),
    where('status', '==', 'published'),
    orderBy('order'),
  );
  return getDocs(q);
}

export async function loadProfileCoursesShape(): Promise<Record<string, unknown>[]> {
  const db = getClientFirestore();
  const lang = process.env.EXPO_PUBLIC_CONTENT_LANGUAGE;
  const q =
    lang && lang.length > 0
      ? query(
          collection(db, 'courses'),
          where('status', '==', 'published'),
          where('language', '==', lang),
          orderBy('order'),
        )
      : query(collection(db, 'courses'), where('status', '==', 'published'), orderBy('order'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const x = d.data();
    return {
      id: d.id,
      course_name: x['title'],
      course_attachment: x['cover_image_url'] || '',
      value: 'Unpaid',
      drink_type: mapCategoryToDrinkType(x['category']),
    };
  });
}

export async function countCourseContent(courseId: string): Promise<{
  lessonCount: number;
  flashCount: number;
  quizCount: number;
}> {
  const lessonsSnap = await listPublishedLessonsForCourse(courseId);
  let flashCount = 0;
  let quizCount = 0;
  const db = getClientFirestore();
  for (const l of lessonsSnap.docs) {
    const [fs, qs] = await Promise.all([
      getDocs(
        query(
          collection(db, 'flashcards'),
          where('lesson_id', '==', l.id),
          where('lesson_status', '==', 'published'),
        ),
      ),
      getDocs(
        query(
          collection(db, 'quiz_questions'),
          where('lesson_id', '==', l.id),
          where('lesson_status', '==', 'published'),
        ),
      ),
    ]);
    flashCount += fs.size;
    quizCount += qs.size;
  }
  return { lessonCount: lessonsSnap.size, flashCount, quizCount };
}

/** Single synthetic “theme” row for ThemesScr (one Firestore course ≡ one lane). */
export async function loadSyntheticThemeRow(courseId: string, courseTitleFromNav: string) {
  const db = getClientFirestore();
  const cSnap = await getDoc(doc(db, 'courses', courseId));
  const title = cSnap.exists() ? String(cSnap.data()['title'] || courseTitleFromNav) : courseTitleFromNav;
  const cover = cSnap.exists() ? String(cSnap.data()['cover_image_url'] || '') : '';
  const { lessonCount, flashCount, quizCount } = await countCourseContent(courseId);
  return {
    id: courseId,
    title,
    theme_attachment: cover,
    status: 'not started',
    theme_type: 'Free',
    user_lesson_count: 0,
    lesson_count: lessonCount,
    userflashcard: 0,
    totalaflashcard: flashCount,
    usersquize: 0,
    totalquizes: quizCount,
  };
}

function lessonToRailsListItem(docId: string, data: DocumentData, index: number) {
  return {
    id: docId,
    type: 'lesson',
    attributes: {
      title: data['title'],
      name: data['title'],
      status: 'not started',
      lesson_type: 'Free',
      user_count: 0,
      total_count: 1,
      order_no: data['order'] ?? index,
      lesson_index: index,
    },
  };
}

function flashToRailsListItem(
  docId: string,
  data: DocumentData,
  courseId: string,
  themeName: string,
) {
  return {
    id: docId,
    type: 'flash_card',
    theme_id: courseId,
    status: 'not started',
    product_type: 'Free',
    user_count: 0,
    total_count: 1,
    title: themeName,
    attributes: {
      title: themeName,
      theme_id: courseId,
    },
  };
}

function quizExamStubRow(courseId: string, quizCount: number, themeName: string) {
  if (quizCount < 1) return null;
  return {
    id: `fs-quiz-${courseId}`,
    title: 'Quiz',
    theme_id: courseId,
    status: 'not started',
    product_type: 'Free',
    value: 'Free',
    user_count: 0,
    total_count: quizCount,
    type: 'quiz_exam',
    attributes: { status: 'not started' },
  };
}

/** Mirrors `lessons/list?theme_id=` bundle for CatelogueFiveController. */
export async function loadLessonsListBundle(courseId: string, courseNameFromNav: string) {
  const db = getClientFirestore();
  const cSnap = await getDoc(doc(db, 'courses', courseId));
  const courseTitle = cSnap.exists() ? String(cSnap.data()['title'] || courseNameFromNav) : courseNameFromNav;
  const parts = courseTitle.split('—');
  const themeLabel = parts.length > 1 ? parts[parts.length - 1]!.trim() : courseTitle;

  const lessonsSnap = await listPublishedLessonsForCourse(courseId);
  const lessonsData = lessonsSnap.docs.map((d, i) => lessonToRailsListItem(d.id, d.data(), i));

  const flashRails: unknown[] = [];
  let flashStubMeta: Record<string, unknown> | null = null;
  for (const l of lessonsSnap.docs) {
    const fs = await getDocs(
      query(
        collection(db, 'flashcards'),
        where('lesson_id', '==', l.id),
        where('lesson_status', '==', 'published'),
        orderBy('order'),
      ),
    );
    fs.forEach((fd) => {
      flashRails.push(flashToRailsListItem(fd.id, fd.data(), courseId, themeLabel));
    });
  }
  if (flashRails.length > 0) {
    flashStubMeta = {
      id: 'flash-deck',
      type: 'flash_card',
      theme_id: courseId,
      status: 'not started',
      product_type: 'Free',
      user_count: 0,
      total_count: flashRails.length,
      title: themeLabel,
      attributes: { title: themeLabel, theme_id: courseId },
    };
  }

  let quizCount = 0;
  for (const l of lessonsSnap.docs) {
    const qs = await getDocs(
      query(
        collection(db, 'quiz_questions'),
        where('lesson_id', '==', l.id),
        where('lesson_status', '==', 'published'),
      ),
    );
    quizCount += qs.size;
  }
  const quizStub = quizExamStubRow(courseId, quizCount, themeLabel);

  return {
    lessons: { data: lessonsData },
    course: courseTitle,
    theme: themeLabel,
    course_id: courseId,
    theme_id: courseId,
    flash_cards: { data: flashStubMeta ? [flashStubMeta] : [] },
    quiz_exams: { data: quizStub ? [quizStub] : [] },
  };
}

export async function loadLessonShowPayload(lessonDocId: string, courseId: string) {
  const db = getClientFirestore();
  const [lessonSnap, courseSnap] = await Promise.all([
    getDoc(doc(db, 'lessons', lessonDocId)),
    getDoc(doc(db, 'courses', courseId)),
  ]);
  if (!lessonSnap.exists()) throw new Error('Lesson not found');
  const L = lessonSnap.data()!;
  const courseName = courseSnap.exists() ? String(courseSnap.data()?.['title'] || '') : '';
  const lessonObj = {
    id: lessonSnap.id,
    type: 'lesson',
    attributes: {
      title: L['title'],
      name: L['title'],
      description: L['scenario'] || L['short_description'] || '',
      highlight_description: '',
      short_description: L['short_description'] || '',
      scenario: L['scenario'] || '',
      image: L['image_url'] || null,
      video_file: L['video_url'] || null,
      audio_file: null,
      theme_id: courseId,
      lesson_index: L['order'] ?? 0,
      status: 'not started',
      lesson_type: 'Free',
      user_count: 0,
      total_count: 1,
    },
  };
  return {
    data: lessonObj,
    course: courseName,
    lesson_notes: { note_array: [] as string[] },
  };
}

export async function loadFlashcardsRevealList(courseId: string): Promise<{ data: unknown[] }> {
  const db = getClientFirestore();
  const lessonsSnap = await listPublishedLessonsForCourse(courseId);
  const rows: unknown[] = [];
  for (const l of lessonsSnap.docs) {
    const fs = await getDocs(
      query(
        collection(db, 'flashcards'),
        where('lesson_id', '==', l.id),
        where('lesson_status', '==', 'published'),
        orderBy('order'),
      ),
    );
    fs.forEach((docSnap) => {
      const data = docSnap.data();
      rows.push({
        id: docSnap.id,
        type: 'flash_card',
        status: 'not started',
        attributes: {
          question: data['text'],
          theme_id: courseId,
          course_id: courseId,
          lesson_id: l.id,
          rating: 0,
        },
      });
    });
  }
  return { data: rows };
}

export async function loadQuizExamRailsData(courseId: string): Promise<unknown[]> {
  const db = getClientFirestore();
  const lessonsSnap = await listPublishedLessonsForCourse(courseId);
  const out: unknown[] = [];
  for (const l of lessonsSnap.docs) {
    const qs = await getDocs(
      query(
        collection(db, 'quiz_questions'),
        where('lesson_id', '==', l.id),
        where('lesson_status', '==', 'published'),
        orderBy('order'),
      ),
    );
    qs.forEach((docSnap) => {
      const data = docSnap.data();
      const options = (data['options'] as string[]) || [];
      const correctIndex = Number(data['correct_index'] ?? 0);
      const attr: Record<string, unknown> = {
        question: data['question'],
        name: data['question'],
        question_type: 'radio_button',
        is_correct: [options[correctIndex] ?? options[0] ?? ''],
      };
      options.forEach((o, i) => {
        attr[`option_${i + 1}`] = o;
      });
      out.push({
        id: docSnap.id,
        type: 'quiz_question',
        attributes: attr,
      });
    });
  }
  return out;
}

/** Shell for OverViewController.course_Details */
export async function loadOverViewCourseShell(courseId: string) {
  const db = getClientFirestore();
  const cSnap = await getDoc(doc(db, 'courses', courseId));
  if (!cSnap.exists()) throw new Error('Course not found');
  const c = cSnap.data();
  const { lessonCount, flashCount, quizCount } = await countCourseContent(courseId);
  const description = String(c['full_description'] || c['short_description'] || '');
  return {
    status: 'current',
    user_course_percentage: 0,
    course_themes: 1,
    themes_count: 1,
    course_lessons: lessonCount,
    lesson_count: lessonCount,
    course_flashcards: flashCount,
    user_course_flashcard: 0,
    course_quiz_exams: quizCount,
    user_course_quizzes: 0,
    theme_ids: [courseId],
    point_earned: 0,
    drink_type: 'Wine',
    language_type: String(c['language'] || 'en'),
    course: {
      id: courseId,
      course_name: String(c['title'] || ''),
      description,
      difficulty: '—',
      duration: '0h 0m',
      drink_type: mapCategoryToDrinkType(c['category']),
      certificate: '—',
      language_type: String(c['language'] || 'en'),
      course_quiz_exams: quizCount,
    },
  };
}
