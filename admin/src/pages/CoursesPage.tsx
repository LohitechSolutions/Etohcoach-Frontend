import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import type { CourseDoc } from '@schema';
import { db } from '../firebase';
import { deleteCourseCascade } from '../lib/cascadeDelete';
import { moveOrder } from '../lib/reorder';

type CourseRow = CourseDoc & { id: string };

export function CoursesPage() {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'courses'), orderBy('order'));
    return onSnapshot(
      q,
      (snap) => {
        setCourses(
          snap.docs.map((d) => {
            const data = d.data() as CourseDoc;
            return { id: d.id, ...data };
          }),
        );
        setErr(null);
      },
      (e) => setErr(e.message),
    );
  }, []);

  async function handleNewCourse() {
    setBusy(true);
    setErr(null);
    try {
      let nextOrder = 0;
      if (courses.length > 0) {
        nextOrder = Math.max(...courses.map((c) => c.order)) + 1;
      }
      const draft: CourseDoc = {
        title: 'New course',
        category: 'attract',
        language: 'en',
        status: 'draft',
        order: nextOrder,
      };
      await addDoc(collection(db, 'courses'), draft);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not create course');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(courseId: string, title: string) {
    if (
      !window.confirm(
        `Delete course “${title}” and all lessons, flashcards, and quiz questions under it? This cannot be undone.`,
      )
    ) {
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      await deleteCourseCascade(db, courseId);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setBusy(false);
    }
  }

  async function reorderCourse(index: number, dir: -1 | 1) {
    const sorted = [...courses].sort((a, b) => a.order - b.order);
    await moveOrder(db, 'courses', sorted, index, dir);
  }

  async function handleDuplicateOrderFix() {
    /** Rare: if two courses share `order`, bump duplicates for stable sorting */
    setErr(null);
    const byOrder = new Map<number, CourseRow[]>();
    for (const c of courses) {
      const list = byOrder.get(c.order) ?? [];
      list.push(c);
      byOrder.set(c.order, list);
    }
    for (const [, list] of byOrder) {
      if (list.length < 2) continue;
      const maxSnap = await getDocs(query(collection(db, 'courses'), orderBy('order', 'desc'), limit(1)));
      let next = maxSnap.docs[0] ? (maxSnap.docs[0].data() as CourseDoc).order + 1 : 0;
      for (let i = 1; i < list.length; i++) {
        const row = list[i];
        if (!row) continue;
        await updateDoc(doc(db, 'courses', row.id), { order: next });
        next++;
      }
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Courses</h1>
          <p className="muted">Create courses, then add lessons, flashcards, and quiz content.</p>
        </div>
        <button type="button" className="primary" onClick={handleNewCourse} disabled={busy}>
          New course
        </button>
      </header>
      {err ? <p className="error">{err}</p> : null}
      <ul className="list-cards">
        {[...courses]
          .sort((a, b) => a.order - b.order)
          .map((c, index, arr) => (
            <li key={c.id} className="list-card">
              <div className="list-card-main">
                <Link to={`/courses/${c.id}`} className="list-card-title">
                  {c.title || 'Untitled'}
                </Link>
                <span className={`pill ${c.status}`}>{c.status}</span>
                <span className="muted">{c.category}</span>
                <span className="muted">{c.language}</span>
                <span className="muted">order {c.order}</span>
              </div>
              <div className="list-card-actions">
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => reorderCourse(index, -1)}
                  disabled={index === 0 || busy}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => reorderCourse(index, 1)}
                  disabled={index === arr.length - 1 || busy}
                >
                  Down
                </button>
                <Link to={`/courses/${c.id}`} className="button ghost">
                  Edit
                </Link>
                <button
                  type="button"
                  className="button danger ghost"
                  onClick={() => handleDelete(c.id, c.title)}
                  disabled={busy}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>
      {courses.length === 0 ? <p className="muted">No courses yet. Create one to get started.</p> : null}
      <p className="muted small">
        If ordering looks wrong after imports,{' '}
        <button type="button" className="linkish" onClick={handleDuplicateOrderFix}>
          fix duplicate order values
        </button>
        .
      </p>
    </div>
  );
}
