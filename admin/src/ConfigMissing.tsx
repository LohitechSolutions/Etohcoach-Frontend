/** Shown when `VITE_FIREBASE_*` vars are missing so the app does not fail with a blank screen. */
export function ConfigMissing({ message }: { message: string }) {
  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        maxWidth: 560,
        margin: '48px auto',
        padding: 24,
        lineHeight: 1.5,
      }}
    >
      <h1 style={{ fontSize: '1.35rem', marginBottom: 16 }}>EtOH Coach — Admin</h1>
      <p style={{ color: '#b00020', marginBottom: 16 }}>{message}</p>
      <ol style={{ paddingLeft: 20, margin: 0 }}>
        <li>
          In the Firebase console, open your project → Project settings → Your apps → Web app config.
        </li>
        <li>
          Copy <code>admin/env.example</code> to <code>admin/.env.local</code> and paste the six{' '}
          <code>VITE_FIREBASE_*</code> values.
        </li>
        <li>
          Restart the dev server (<code>npm run dev</code>) so Vite reloads env.
        </li>
      </ol>
      <p style={{ marginTop: 24, fontSize: 14, color: '#555' }}>
        Full walkthrough: <code>docs/FIREBASE_ADMIN_ENV_SETUP.md</code> in the frontend repo.
      </p>
    </div>
  );
}
