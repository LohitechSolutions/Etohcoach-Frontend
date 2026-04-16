import { Link, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { LessonEditorPage } from './pages/LessonEditorPage';
import './App.css';

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="shell">
        <p className="muted pad">Loading…</p>
      </div>
    );
  }
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}

function AdminLayout() {
  const { signOutUser } = useAuth();
  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-brand">
          <strong>EtOH Coach</strong>
          <span className="muted">Admin</span>
        </div>
        <nav className="topbar-nav">
          <Link to="/courses">Courses</Link>
        </nav>
        <button type="button" className="button ghost" onClick={() => void signOutUser()}>
          Sign out
        </button>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Navigate to="courses" replace />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:courseId" element={<CourseDetailPage />} />
        <Route path="courses/:courseId/lessons/:lessonId" element={<LessonEditorPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/courses" replace />} />
    </Routes>
  );
}
