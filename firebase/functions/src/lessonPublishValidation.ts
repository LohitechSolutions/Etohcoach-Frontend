import type * as admin from 'firebase-admin';

/** Same rules as admin `lessonValidation.ts` — server-side safety net. */
export async function validatePublishedLesson(
  db: admin.firestore.Firestore,
  lessonId: string,
): Promise<string | null> {
  const [flashSnap, quizSnap] = await Promise.all([
    db.collection('flashcards').where('lesson_id', '==', lessonId).get(),
    db.collection('quiz_questions').where('lesson_id', '==', lessonId).get(),
  ]);

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
      return `Quiz "${qtext.slice(0, 48) || d.id}" needs at least two answer options.`;
    }
    if (typeof correctIndex !== 'number' || correctIndex < 0 || correctIndex >= options.length) {
      return `Quiz "${qtext.slice(0, 48) || d.id}" has an invalid correct answer.`;
    }
  }

  return null;
}
