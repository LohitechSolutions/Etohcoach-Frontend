import { FormEvent, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function LoginPage() {
  const { user, isAdmin, loading, signInEmail, signOutUser } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/courses';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && user && isAdmin) {
    return <Navigate to={from} replace />;
  }

  const signedInNotAdmin = Boolean(!loading && user && !isAdmin);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signInEmail(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="card login-card" onSubmit={onSubmit}>
        <h1>EtOH Coach admin</h1>
        <p className="muted">Sign in with a Firebase user that has the <code>admin</code> custom claim.</p>
        {signedInNotAdmin ? (
          <p className="error">
            This account is signed in but does not have admin access. Ask an operator to call{' '}
            <code>grantAdmin</code> for your UID, then sign out and sign in again.
            <button type="button" className="linkish block-mt" onClick={() => void signOutUser()}>
              Sign out
            </button>
          </p>
        ) : null}
        <label>
          Email
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" className="primary" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
