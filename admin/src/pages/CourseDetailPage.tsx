import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { CourseCategory, CourseDoc, LessonDoc } from '@schema';
import { db, storage } from '../firebase';
import { moveOrder } from '../lib/reorder';
import { uploadCmsFile } from '../lib/upload';

type LessonRow = LessonDoc & { id: string };

const categories: CourseCategory[] = ['attract', 'convince', 'convert'];

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const dirtyRef = useRef(false);
  const [course, setCourse] = useState<(CourseDoc & { id: string }) | null>(null);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [draft, setDraft] = useState<CourseDoc | null>(null);
  const [dirty, setDirty] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function markDirty() {
    dirtyRef.current = true;
    setDirty(true);
  }

  useEffect(() => {
    if (!courseId) return;
    setErr(null);
    return onSnapshot(
      doc(db, 'courses', courseId),
      (snap) => {
        if (!snap.exists()) {
          setCourse(null);
          setDraft(null);
          return;
        }
        const data = snap.data() as CourseDoc;
        const row = { id: snap.id, ...data };
        setCourse(row);
        if (!dirtyRef.current) {
          setDraft(data);
        }
      },
      (e) => setErr(e.message),
    );
  }, [courseId]);

  useEffect(() => {
    if (!courseId) return;
    const q = query(
      collection(db, 'lessons'),
      where('course_id', '==', courseId),
      orderBy('order'),
    );
    return onSnapshot(
      q,
      (snap) => {
        setLessons(
          snap.docs.map((d) => {
            const data = d.data() as LessonDoc;
            return { id: d.id, ...data };
          }),
        );
      },
      (e) => setErr(e.message),
    );
  }, [courseId]);

  async function saveCourse(e: FormEvent) {
    e.preventDefault();
    if (!courseId || !draft) return;
    setBusy(true);
    setErr(null);
    try {
      await updateDoc(doc(db, 'courses', courseId), {
        title: draft.title,
        short_description: draft.short_description ?? '',
        full_description: draft.full_description ?? '',
        category: draft.category,
        language: draft.language,
        cover_image_url: draft.cover_image_url ?? '',
        status: draft.status,
        order: draft.order,
      });
      dirtyRef.current = false;
      setDirty(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  async function addLesson() {
    if (!courseId) return;
    setBusy(true);
    setErr(null);
    try {
      let nextOrder = 0;
      if (lessons.length > 0) {
        nextOrder = Math.max(...lessons.map((l) => l.order)) + 1;
      }
      const lesson: LessonDoc = {
        course_id: courseId,
        title: 'New lesson',
        language: draft?.language ?? 'en',
        status: 'draft',
        order: nextOrder,
      };
      const ref = await addDoc(collection(db, 'lessons'), lesson);
      navigate(`/courses/${courseId}/lessons/${ref.id}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not add lesson');
    } finally {
      setBusy(false);
    }
  }

  async function onCoverUpload(file: File) {
    if (!courseId) return;
    setBusy(true);
    setErr(null);
    try {
      const url = await uploadCmsFile(storage, `courses/${courseId}`, file);
      setDraft((d) => (d ? { ...d, cover_image_url: url } : d));
      markDirty();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  async function reorderLesson(index: number, dir: -1 | 1) {
    const sorted = [...lessons].sort((a, b) => a.order - b.order);
    await moveOrder(db, 'lessons', sorted, index, dir);
  }

  if (!courseId) {
    return <p className="error">Missing course id</p>;
  }

  if (!course || !draft) {
    return (
      <div className="page">
        <p className="muted">{err ? err : 'Loading course…'}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <nav className="crumbs">
        <Link to="/courses">Courses</Link>
        <span>/</span>
        <span>{draft.title}</span>
      </nav>
      <header className="page-head">
        <h1>Edit course</h1>
      </header>
      {err ? <p className="error">{err}</p> : null}

      <form className="card form-grid" onSubmit={saveCourse}>
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
          Full description
          <textarea
            value={draft.full_description ?? ''}
            onChange={(e) => {
              markDirty();
              setDraft({ ...draft, full_description: e.target.value });
            }}
            rows={4}
          />
        </label>
        <label>
          Category
          <select
            value={draft.category}
            onChange={(e) => {
              markDirty();
              setDraft({ ...draft, category: e.target.value as CourseCategory });
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
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
              setDraft({ ...draft, status: e.target.value as CourseDoc['status'] });
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
          Cover image URL
          <input
            value={draft.cover_image_url ?? ''}
            onChange={(e) => {
              markDirty();
              setDraft({ ...draft, cover_image_url: e.target.value });
            }}
            placeholder="https://…"
          />
        </label>
        <div className="field">
          <span className="label">Cover image file</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onCoverUpload(f);
              e.target.value = '';
            }}
            disabled={busy}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="primary" disabled={busy || !dirty}>
            Save course
          </button>
        </div>
      </form>

      <section className="section">
        <header className="page-head">
          <h2>Lessons</h2>
          <button type="button" className="primary" onClick={addLesson} disabled={busy}>
            New lesson
          </button>
        </header>
        <ul className="list-cards">
          {[...lessons]
            .sort((a, b) => a.order - b.order)
            .map((lesson, index, arr) => (
              <li key={lesson.id} className="list-card">
                <div className="list-card-main">
                  <Link to={`/courses/${courseId}/lessons/${lesson.id}`} className="list-card-title">
                    {lesson.title || 'Untitled lesson'}
                  </Link>
                  <span className={`pill ${lesson.status}`}>{lesson.status}</span>
                  <span className="muted">order {lesson.order}</span>
                </div>
                <div className="list-card-actions">
                  <button
                    type="button"
                    className="button ghost"
                    onClick={() => reorderLesson(index, -1)}
                    disabled={index === 0 || busy}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="button ghost"
                    onClick={() => reorderLesson(index, 1)}
                    disabled={index === arr.length - 1 || busy}
                  >
                    Down
                  </button>
                  <Link to={`/courses/${courseId}/lessons/${lesson.id}`} className="button ghost">
                    Edit
                  </Link>
                </div>
              </li>
            ))}
        </ul>
        {lessons.length === 0 ? <p className="muted">No lessons yet.</p> : null}
      </section>
    </div>
  );
}
