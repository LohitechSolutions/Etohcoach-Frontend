import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

const BATCH = 400;

async function deleteQueryDocs(firestore: Firestore, q: ReturnType<typeof query>): Promise<void> {
  const snap = await getDocs(q);
  let batch = writeBatch(firestore);
  let n = 0;
  for (const d of snap.docs) {
    batch.delete(d.ref);
    n++;
    if (n >= BATCH) {
      await batch.commit();
      batch = writeBatch(firestore);
      n = 0;
    }
  }
  if (n > 0) await batch.commit();
}

export async function deleteLessonCascade(firestore: Firestore, lessonId: string): Promise<void> {
  await deleteQueryDocs(
    firestore,
    query(collection(firestore, 'flashcards'), where('lesson_id', '==', lessonId)),
  );
  await deleteQueryDocs(
    firestore,
    query(collection(firestore, 'quiz_questions'), where('lesson_id', '==', lessonId)),
  );
  await deleteDoc(doc(firestore, 'lessons', lessonId));
}

export async function deleteCourseCascade(firestore: Firestore, courseId: string): Promise<void> {
  const lessons = await getDocs(
    query(collection(firestore, 'lessons'), where('course_id', '==', courseId)),
  );
  for (const l of lessons.docs) {
    await deleteLessonCascade(firestore, l.id);
  }
  await deleteDoc(doc(firestore, 'courses', courseId));
}
