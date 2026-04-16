/**
 * Firestore content model for EtOH Coach CMS + app reads (M0 frozen).
 * Decisions: docs/decisions/0001-m0-architecture-product-decisions.md
 *
 * Storage (M1): upload CMS binaries under prefix `etoh_cms/` — see `storage.rules`.
 * Store resulting download URLs in `cover_image_url`, `image_url`, `video_url`, etc.
 */

/** Prefix for Firebase Storage objects governed by `storage.rules` */
export const STORAGE_CMS_PREFIX = 'etoh_cms' as const;

/** Collection ids — keep in sync with firestore.rules */
export const COLLECTIONS = {
  courses: 'courses',
  lessons: 'lessons',
  flashcards: 'flashcards',
  quiz_questions: 'quiz_questions',
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

export type PublishStatus = 'draft' | 'published';

/** Mirrors parent lesson `status` on children for rules (no draft leakage). */
export type LessonStatusDenorm = PublishStatus;

/** Client course category: single source of truth vs a separate themes collection (M0). */
export type CourseCategory = 'attract' | 'convince' | 'convert';

export interface CourseDoc {
  title: string;
  short_description?: string;
  full_description?: string;
  /** Attract / Convince / Convert — filters and admin “theme lane” without a themes table (M0). */
  category: CourseCategory;
  language: string;
  /** Public HTTPS URL or Storage download URL after upload. */
  cover_image_url?: string;
  status: PublishStatus;
  /** Display order within lists (e.g. catalogue). */
  order: number;
}

export interface LessonDoc {
  course_id: string;
  title: string;
  short_description?: string;
  scenario?: string;
  language: string;
  video_url?: string;
  image_url?: string;
  status: PublishStatus;
  order: number;
}

export interface FlashcardDoc {
  lesson_id: string;
  /** Denormalized from parent lesson `status` — required for secure client reads. */
  lesson_status: LessonStatusDenorm;
  text: string;
  image_url?: string;
  order: number;
}

export interface QuizQuestionDoc {
  lesson_id: string;
  lesson_status: LessonStatusDenorm;
  question: string;
  image_url?: string;
  /** Minimum two strings; exactly one index in `correct_index` is correct. */
  options: string[];
  correct_index: number;
  order: number;
}
