import { collection, getDocs, query, where } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

/** @returns error message or null if lesson can be published */
export async function validateLessonForPublish(
  firestore: Firestore,
  lessonId: string,
): Promise<string | null> {
  const flashQ = query(collection(firestore, 'flashcards'), where('lesson_id', '==', lessonId));
  const quizQ = query(collection(firestore, 'quiz_questions'), where('lesson_id', '==', lessonId));
  const [flashSnap, quizSnap] = await Promise.all([getDocs(flashQ), getDocs(quizQ)]);

  if (flashSnap.size < 1) {
    return 'Add at least one flashcard before publishing this lesson.';
  }
  if (quizSnap.size < 1) {
    return 'Add at least one quiz question before publishing this lesson.';
  }

  for (const d of quizSnap.docs) {
    const data = d.data();
    const options = data['options'] as unknown;
    const correctIndex = data['correct_index'] as unknown;
    const qtext = typeof data['question'] === 'string' ? data['question'] : '';

    if (!Array.isArray(options) || options.length < 2) {
      return `Quiz “${qtext.slice(0, 48) || d.id}” needs at least two answer options.`;
    }
    if (typeof correctIndex !== 'number' || correctIndex < 0 || correctIndex >= options.length) {
      return `Quiz “${qtext.slice(0, 48) || d.id}” has an invalid correct answer.`;
    }
  }

  return null;
}
