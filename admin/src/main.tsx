import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import App from './App';
import { ConfigMissing } from './ConfigMissing';
import { getFirebaseInitError } from './firebase';

const el = document.getElementById('root');
if (!el) {
  throw new Error('Root element #root not found');
}

const firebaseConfigError = getFirebaseInitError();

createRoot(el).render(
  firebaseConfigError ? (
    <ConfigMissing message={firebaseConfigError} />
  ) : (
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  ),
);
