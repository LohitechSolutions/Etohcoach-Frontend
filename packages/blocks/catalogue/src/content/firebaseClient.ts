import type { FirebaseOptions } from 'firebase/app';
import { initializeApp, getApps } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

let cached: Firestore | null = null;

/** Expo inlines EXPO_PUBLIC_* at bundle time (see react-native/app.config.js + .env). */
export function getClientFirestore(): Firestore {
  if (cached) return cached;
  const options: FirebaseOptions = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  };
  if (!options.apiKey || !options.projectId) {
    throw new Error(
      'Firestore: set EXPO_PUBLIC_FIREBASE_API_KEY and EXPO_PUBLIC_FIREBASE_PROJECT_ID in react-native/.env',
    );
  }
  const app = getApps().length > 0 ? getApps()[0]! : initializeApp(options);
  cached = getFirestore(app);
  return cached;
}
