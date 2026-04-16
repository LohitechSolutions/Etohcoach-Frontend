import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { validatePublishedLesson } from './lessonPublishValidation';

const REGION = 'europe-west1';

/** Firestore batch ops must stay under 500; keep margin for concurrent work. */
const MAX_BATCH = 400;

async function syncCollection(
  db: admin.firestore.Firestore,
  lessonId: string,
  status: 'draft' | 'published',
  collection: string,
) {
  const snap = await db.collection(collection).where('lesson_id', '==', lessonId).get();
  let batch = db.batch();
  let pending = 0;

  for (const doc of snap.docs) {
    if (doc.data().lesson_status === status) continue;
    batch.update(doc.ref, { lesson_status: status });
    pending++;
    if (pending >= MAX_BATCH) {
      await batch.commit();
      batch = db.batch();
      pending = 0;
    }
  }
  if (pending > 0) {
    await batch.commit();
  }
}

async function downgradePublishedLessonIfInvalid(lessonId: string): Promise<void> {
  const db = admin.firestore();
  const lessonRef = db.collection('lessons').doc(lessonId);
  const lessonSnap = await lessonRef.get();
  if (!lessonSnap.exists) return;
  if (lessonSnap.data()?.status !== 'published') return;
  const err = await validatePublishedLesson(db, lessonId);
  if (err) {
    await lessonRef.update({
      status: 'draft',
      publish_validation_error: err,
    });
  }
}

/**
 * When a lesson's `status` changes, mirror it on all child flashcards and quiz_questions
 * as `lesson_status` so Firestore rules can hide drafts from non-admin clients.
 *
 * Before syncing children to `published`, validates ≥1 flashcard, ≥1 quiz, and quiz shape
 * (M2). Invalid publishes are reverted to `draft` with `publish_validation_error`.
 */
export const syncLessonStatusToChildren = functions.region(REGION).firestore
  .document('lessons/{lessonId}')
  .onWrite(async (change, context) => {
    if (!change.after.exists) {
      return null;
    }
    const db = admin.firestore();
    const lessonId = context.params.lessonId as string;
    const beforeStatus = change.before.exists ? change.before.data()?.status : undefined;
    const data = change.after.data();
    const status = data?.status;

    if (status !== 'draft' && status !== 'published') {
      return null;
    }

    if (status === 'published' && beforeStatus !== 'published') {
      const err = await validatePublishedLesson(db, lessonId);
      if (err) {
        await change.after.ref.update({
          status: 'draft',
          publish_validation_error: err,
        });
        return null;
      }
    }

    if (beforeStatus === status) {
      return null;
    }

    await Promise.all([
      syncCollection(db, lessonId, status, 'flashcards'),
      syncCollection(db, lessonId, status, 'quiz_questions'),
    ]);
    return null;
  });

/** If a published lesson no longer meets publish rules, move it back to draft. */
export const onFlashcardDeleted = functions.region(REGION).firestore
  .document('flashcards/{flashcardId}')
  .onDelete(async (snap) => {
    const lessonId = snap.data()?.lesson_id;
    if (typeof lessonId !== 'string' || !lessonId) return null;
    await downgradePublishedLessonIfInvalid(lessonId);
    return null;
  });

/** Create / update / delete — keeps published lessons from violating quiz rules after edits. */
export const onQuizQuestionWrite = functions.region(REGION).firestore
  .document('quiz_questions/{questionId}')
  .onWrite(async (change) => {
    const lessonId = change.after.exists
      ? (change.after.data()?.lesson_id as string | undefined)
      : (change.before.data()?.lesson_id as string | undefined);
    if (typeof lessonId !== 'string' || !lessonId) return null;
    await downgradePublishedLessonIfInvalid(lessonId);
    return null;
  });
