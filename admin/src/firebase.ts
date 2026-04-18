import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/** Call before render to show a setup screen instead of a blank page when `.env.local` is missing. */
export function getFirebaseInitError(): string | null {
  const missing = Object.entries(cfg)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length === 0) {
    return null;
  }
  return `Missing Firebase env: ${missing.join(', ')}. Copy admin/env.example to admin/.env.local and fill values from Firebase Console → Project settings → Your apps.`;
}

let firebaseApp: FirebaseApp | undefined;

function getApp(): FirebaseApp {
  if (!firebaseApp) {
    const err = getFirebaseInitError();
    if (err) {
      throw new Error(err);
    }
    firebaseApp = initializeApp(cfg);
  }
  return firebaseApp;
}

/** Lazy accessors so importing this module never throws — only first use does. */
export const fb = {
  get auth(): Auth {
    return getAuth(getApp());
  },
  get db(): Firestore {
    return getFirestore(getApp());
  },
  get storage(): FirebaseStorage {
    return getStorage(getApp());
  },
};
