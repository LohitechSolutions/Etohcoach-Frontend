import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { FlashcardDoc, LessonDoc, QuizQuestionDoc } from '@schema';
import { fb } from '../firebase';
import { deleteLessonCascade } from '../lib/cascadeDelete';
import { validateLessonForPublish } from '../lib/lessonValidation';
import { moveOrder } from '../lib/reorder';
import { uploadCmsFile } from '../lib/upload';

type FlashRow = FlashcardDoc & { id: string };
type QuizRow = QuizQuestionDoc & { id: string };

export function LessonEditorPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const dirtyRef = useRef(false);
  const [lesson, setLesson] = useState<(LessonDoc & { id: string }) | null>(null);
  const [draft, setDraft] = useState<LessonDoc | null>(null);
  const [dirty, setDirty] = useState(false);
  const [flashcards, setFlashcards] = useState<FlashRow[]>([]);
  const [quizzes, setQuizzes] = useState<QuizRow[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [publishHint, setPublishHint] = useState<string | null>(null);

  function markDirty() {
    dirtyRef.current = true;
    setDirty(true);
  }

  useEffect(() => {
    if (!lessonId) return;
    return onSnapshot(
      doc(fb.db, 'lessons', lessonId),
      (snap) => {
        if (!snap.exists()) {
          setLesson(null);
          setDraft(null);
          return;
        }
        const data = snap.data() as LessonDoc;
        setLesson({ id: snap.id, ...data });
        if (!dirtyRef.current) {
          setDraft(data);
        }
      },
      (e) => setErr(e.message),
    );
  }, [lessonId]);

  useEffect(() => {
    if (!lessonId) return;
    const q = query(
      collection(fb.db, 'flashcards'),
      where('lesson_id', '==', lessonId),
      orderBy('order'),
    );
    return onSnapshot(
      q,
      (snap) => {
        setFlashcards(
          snap.docs.map((d) => {
            const data = d.data() as FlashcardDoc;
            return { id: d.id, ...data };
          }),
        );
      },
      (e) => setErr(e.message),
    );
  }, [lessonId]);

  useEffect(() => {
    if (!lessonId) return;
    const q = query(
      collection(fb.db, 'quiz_questions'),
      where('lesson_id', '==', lessonId),
      orderBy('order'),
    );
    return onSnapshot(
      q,
      (snap) => {
        setQuizzes(
          snap.docs.map((d) => {
            const data = d.data() as QuizQuestionDoc;
            return { id: d.id, ...data };
          }),
        );
      },
      (e) => setErr(e.message),
    );
  }, [lessonId]);

  async function saveLesson(e: FormEvent) {
    e.preventDefault();
    if (!lessonId || !draft) return;
    if (draft.status === 'published') {
      const v = await validateLessonForPublish(fb.db, lessonId);
      if (v) {
        setErr(v);
        return;
      }
    }
    setBusy(true);
    setErr(null);
    setPublishHint(null);
    try {
      await updateDoc(doc(fb.db, 'lessons', lessonId), {
        title: draft.title,
        short_description: draft.short_description ?? '',
        scenario: draft.scenario ?? '',
        language: draft.language,
        video_url: draft.video_url ?? '',
        image_url: draft.image_url ?? '',
        status: draft.status,
        order: draft.order,
        course_id: draft.course_id,
        publish_validation_error: deleteField(),
      });
      dirtyRef.current = false;
      setDirty(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  async function publishLesson() {
    if (!lessonId || !draft) return;
    const v = await validateLessonForPublish(fb.db, lessonId);
    if (v) {
      setPublishHint(v);
      setErr(v);
      return;
    }
    setBusy(true);
    setErr(null);
    setPublishHint(null);
    try {
      await updateDoc(doc(fb.db, 'lessons', lessonId), {
        status: 'published',
        publish_validation_error: deleteField(),
      });
      setDraft({ ...draft, status: 'published' });
      dirtyRef.current = false;
      setDirty(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Publish failed');
    } finally {
      setBusy(false);
    }
  }

  async function addFlashcard() {
    if (!lessonId || !lesson) return;
    setBusy(true);
    setErr(null);
    try {
      const sorted = [...flashcards].sort((a, b) => a.order - b.order);
      const nextOrder = sorted.length ? sorted[sorted.length - 1]!.order + 1 : 0;
      const row: FlashcardDoc = {
        lesson_id: lessonId,
        lesson_status: lesson.status,
        text: '',
        order: nextOrder,
      };
      await addDoc(collection(fb.db, 'flashcards'), row);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not add flashcard');
    } finally {
      setBusy(false);
    }
  }

  async function addQuiz() {
    if (!lessonId || !lesson) return;
    setBusy(true);
    setErr(null);
    try {
      const sorted = [...quizzes].sort((a, b) => a.order - b.order);
      const nextOrder = sorted.length ? sorted[sorted.length - 1]!.order + 1 : 0;
      const row: QuizQuestionDoc = {
        lesson_id: lessonId,
        lesson_status: lesson.status,
        question: '',
        options: ['', ''],
        correct_index: 0,
        order: nextOrder,
      };
      await addDoc(collection(fb.db, 'quiz_questions'), row);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not add question');
    } finally {
      setBusy(false);
    }
  }

  async function saveFlashcard(row: FlashRow) {
    setBusy(true);
    setErr(null);
    try {
      await updateDoc(doc(fb.db, 'flashcards', row.id), {
        text: row.text,
        image_url: row.image_url ?? '',
        order: row.order,
        lesson_status: lesson?.status ?? 'draft',
      });
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Save flashcard failed');
    } finally {
      setBusy(false);
    }
  }

  async function saveQuiz(row: QuizRow) {
    const options = row.options.map((s) => s.trim()).filter((s) => s.length > 0);
    if (options.length < 2) {
      setErr('Each quiz needs at least two non-empty answer lines.');
      return;
    }
    let correct_index = row.correct_index;
    if (correct_index < 0 || correct_index >= options.length) {
      correct_index = 0;
    }
    setBusy(true);
    setErr(null);
    try {
      await updateDoc(doc(fb.db, 'quiz_questions', row.id), {
        question: row.question,
        image_url: row.image_url ?? '',
        options,
        correct_index,
        order: row.order,
        lesson_status: lesson?.status ?? 'draft',
      });
      setQuizzes((list) =>
        list.map((x) => (x.id === row.id ? { ...row, options, correct_index } : x)),
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Save quiz failed');
    } finally {
      setBusy(false);
    }
  }

  async function deleteFlash(id: string) {
    if (!window.confirm('Delete this flashcard?')) return;
    await deleteDoc(doc(fb.db, 'flashcards', id));
  }

  async function deleteQuiz(id: string) {
    if (!window.confirm('Delete this question?')) return;
    await deleteDoc(doc(fb.db, 'quiz_questions', id));
  }

  async function uploadLessonMedia(kind: 'video' | 'image', file: File) {
    if (!lessonId) return;
    setBusy(true);
    setErr(null);
    try {
      const url = await uploadCmsFile(fb.storage, `lessons/${lessonId}`, file);
      if (kind === 'video') {
        setDraft((d) => (d ? { ...d, video_url: url } : d));
      } else {
        setDraft((d) => (d ? { ...d, image_url: url } : d));
      }
      markDirty();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  async function removeLesson() {
    if (!lessonId || !courseId) return;
    if (!window.confirm('Delete this lesson and all flashcards and quiz questions?')) return;
    setBusy(true);
    try {
      await deleteLessonCascade(fb.db, lessonId);
      navigate(`/courses/${courseId}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setBusy(false);
    }
  }

  if (!courseId || !lessonId) {
    return <p className="error">Missing route params</p>;
  }

  if (!lesson || !draft) {
    return (
      <div className="page">
        <p className="muted">{err ? err : 'Loading lesson…'}</p>
      </div>
    );
  }

  const sortedFlash = [...flashcards].sort((a, b) => a.order - b.order);
  const sortedQuiz = [...quizzes].sort((a, b) => a.order - b.order);

  return (
    <div className="page">
      <nav className="crumbs">
        <Link to="/courses">Courses</Link>
        <span>/</span>
        <Link to={`/courses/${courseId}`}>Course</Link>
        <span>/</span>
        <span>{draft.title}</span>
      </nav>
      <header className="page-head">
        <h1>Edit lesson</h1>
        <button type="button" className="button danger ghost" onClick={removeLesson} disabled={busy}>
          Delete lesson
        </button>
      </header>
      {err ? <p className="error">{err}</p> : null}
      {draft.publish_validation_error && !err ? (
        <p className="error" role="status">
          {draft.publish_validation_error} (Lesson was moved back to draft. Fix content and publish again.)
        </p>
      ) : null}
      {publishHint && !err ? <p className="muted">{publishHint}</p> : null}

      <form className="card form-grid" onSubmit={saveLesson}>
        <label>
          Title
          <input
            value={draft.title}
            onChange={(e) => {
              markDirty();
              setDraft({ ...draft, title: e.target.value });
            }}
            required
          />
        </label>
        <label>
          Short description
          <textarea
            value={draft.short_description ?? ''}
            onChange={(e) => {
              markDirty();
              setDraft({ ...draft, short_description: e.target.value });
            }}
            rows={2}
          />
        </label>
        <label>
          Scenario
          <textarea
            value={draft.scenario ?? ''}
            onChange={(e) => {
              markDirty();
              setDraft({ ...draft, scenario: e.target.value });
            }}
            rows={3}
          />
        </label>
        <label>
          Language
          <input
            value={draft.language}
            onChange={(e) => {
              markDirty();
              setDraft({ ...draft, language: e.target.value });
            }}
          />
        </label>
        <label>
          Status
          <select
            value={draft.status}
            onChange={(e) => {
              markDirty();
              setDraft({ ...draft, status: e.target.value as LessonDoc['status'] });
            }}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </label>
        <label>
          Order
          <input
            type="number"
            value={draft.order}
            onChange={(e) => {
              markDirty();
              setDraft({ ...draft, order: Number(e.target.value) });
            }}
          />
        </label>
        <label>
          Video URL
          <input
            value={draft.video_url ?? ''}
            onChange={(e) => {
              markDirty();
              setDraft({ ...draft, video_url: e.target.value });
            }}
          />
        </label>
        <label>
          Image URL
          <input
            value={draft.image_url ?? ''}
            onChange={(e) => {
              markDirty();
              setDraft({ ...draft, image_url: e.target.value });
            }}
          />
        </label>
        <div className="field row">
          <div>
            <span className="label">Video file</span>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void uploadLessonMedia('video', f);
                e.target.value = '';
              }}
              disabled={busy}
            />
          </div>
          <div>
            <span className="label">Image file</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void uploadLessonMedia('image', f);
                e.target.value = '';
              }}
              disabled={busy}
            />
          </div>
        </div>
        <div className="form-actions spread">
          <button type="submit" className="primary" disabled={busy || !dirty}>
            Save lesson
          </button>
          <button type="button" className="primary ghost" onClick={publishLesson} disabled={busy}>
            Publish (validate & set published)
          </button>
        </div>
      </form>

      <section className="section">
        <header className="page-head">
          <h2>Flashcards</h2>
          <button type="button" className="primary" onClick={addFlashcard} disabled={busy}>
            Add flashcard
          </button>
        </header>
        <ul className="stack">
          {sortedFlash.map((row, index) => (
            <li key={row.id} className="card subcard">
              <FlashcardEditor
                row={row}
                disabled={busy}
                onChange={(next) => {
                  setFlashcards((list) => list.map((x) => (x.id === row.id ? next : x)));
                }}
                onSave={(r) => saveFlashcard(r)}
                onDelete={() => deleteFlash(row.id)}
                onMove={(dir) => moveOrder(fb.db, 'flashcards', sortedFlash, index, dir)}
                canUp={index > 0}
                canDown={index < sortedFlash.length - 1}
                onUploadImage={async (file) => {
                  const url = await uploadCmsFile(fb.storage, `lessons/${lessonId}/flashcards/${row.id}`, file);
                  const next = { ...row, image_url: url };
                  setFlashcards((list) => list.map((x) => (x.id === row.id ? next : x)));
                  await updateDoc(doc(fb.db, 'flashcards', row.id), { image_url: url });
                }}
              />
            </li>
          ))}
        </ul>
        {sortedFlash.length === 0 ? <p className="muted">No flashcards yet.</p> : null}
      </section>

      <section className="section">
        <header className="page-head">
          <h2>Quiz</h2>
          <button type="button" className="primary" onClick={addQuiz} disabled={busy}>
            Add question
          </button>
        </header>
        <ul className="stack">
          {sortedQuiz.map((row, index) => (
            <li key={row.id} className="card subcard">
              <QuizEditor
                row={row}
                disabled={busy}
                onChange={(next) => {
                  setQuizzes((list) => list.map((x) => (x.id === row.id ? next : x)));
                }}
                onSave={(r) => saveQuiz(r)}
                onDelete={() => deleteQuiz(row.id)}
                onMove={(dir) => moveOrder(fb.db, 'quiz_questions', sortedQuiz, index, dir)}
                canUp={index > 0}
                canDown={index < sortedQuiz.length - 1}
                onUploadImage={async (file) => {
                  const url = await uploadCmsFile(fb.storage, `lessons/${lessonId}/quiz/${row.id}`, file);
                  const next = { ...row, image_url: url };
                  setQuizzes((list) => list.map((x) => (x.id === row.id ? next : x)));
                  await updateDoc(doc(fb.db, 'quiz_questions', row.id), { image_url: url });
                }}
              />
            </li>
          ))}
        </ul>
        {sortedQuiz.length === 0 ? <p className="muted">No quiz questions yet.</p> : null}
      </section>
    </div>
  );
}

function FlashcardEditor({
  row,
  disabled,
  onChange,
  onSave,
  onDelete,
  onMove,
  canUp,
  canDown,
  onUploadImage,
}: {
  row: FlashRow;
  disabled: boolean;
  onChange: (next: FlashRow) => void;
  onSave: (r: FlashRow) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
  canUp: boolean;
  canDown: boolean;
  onUploadImage: (file: File) => Promise<void>;
}) {
  return (
    <div className="form-grid tight">
      <label>
        Text
        <textarea
          value={row.text}
          onChange={(e) => onChange({ ...row, text: e.target.value })}
          rows={3}
        />
      </label>
      <label>
        Image URL
        <input
          value={row.image_url ?? ''}
          onChange={(e) => onChange({ ...row, image_url: e.target.value })}
        />
      </label>
      <div className="field">
        <span className="label">Image file</span>
        <input
          type="file"
          accept="image/*"
          disabled={disabled}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onUploadImage(f);
            e.target.value = '';
          }}
        />
      </div>
      <div className="form-actions spread">
        <div className="btn-row">
          <button type="button" className="button ghost" disabled={!canUp || disabled} onClick={() => onMove(-1)}>
            Up
          </button>
          <button type="button" className="button ghost" disabled={!canDown || disabled} onClick={() => onMove(1)}>
            Down
          </button>
        </div>
        <div className="btn-row">
          <button type="button" className="primary" onClick={() => onSave(row)} disabled={disabled}>
            Save
          </button>
          <button type="button" className="button danger ghost" onClick={onDelete} disabled={disabled}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function QuizEditor({
  row,
  disabled,
  onChange,
  onSave,
  onDelete,
  onMove,
  canUp,
  canDown,
  onUploadImage,
}: {
  row: QuizRow;
  disabled: boolean;
  onChange: (next: QuizRow) => void;
  onSave: (r: QuizRow) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
  canUp: boolean;
  canDown: boolean;
  onUploadImage: (file: File) => Promise<void>;
}) {
  const optionsJoined = row.options.join('\n');

  return (
    <div className="form-grid tight">
      <label>
        Question
        <textarea
          value={row.question}
          onChange={(e) => onChange({ ...row, question: e.target.value })}
          rows={2}
        />
      </label>
      <label>
        Answers (one per line, ≥2)
        <textarea
          value={optionsJoined}
          onChange={(e) => {
            const lines = e.target.value.split('\n');
            onChange({ ...row, options: lines });
          }}
          rows={4}
        />
      </label>
      <label>
        Correct answer (1-based line number)
        <input
          type="number"
          min={1}
          value={row.correct_index + 1}
          onChange={(e) => {
            const n = Number(e.target.value);
            onChange({ ...row, correct_index: Math.max(0, n - 1) });
          }}
        />
      </label>
      <label>
        Image URL
        <input
          value={row.image_url ?? ''}
          onChange={(e) => onChange({ ...row, image_url: e.target.value })}
        />
      </label>
      <div className="field">
        <span className="label">Image file</span>
        <input
          type="file"
          accept="image/*"
          disabled={disabled}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onUploadImage(f);
            e.target.value = '';
          }}
        />
      </div>
      <div className="form-actions spread">
        <div className="btn-row">
          <button type="button" className="button ghost" disabled={!canUp || disabled} onClick={() => onMove(-1)}>
            Up
          </button>
          <button type="button" className="button ghost" disabled={!canDown || disabled} onClick={() => onMove(1)}>
            Down
          </button>
        </div>
        <div className="btn-row">
          <button type="button" className="primary" onClick={() => onSave(row)} disabled={disabled}>
            Save
          </button>
          <button type="button" className="button danger ghost" onClick={onDelete} disabled={disabled}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
