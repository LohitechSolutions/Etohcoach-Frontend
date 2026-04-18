import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { fb } from '../firebase';

export type AuthContextValue = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(fb.auth, async (u) => {
      setLoading(true);
      setUser(u);
      try {
        if (!u) {
          setIsAdmin(false);
          return;
        }
        const token = await u.getIdTokenResult(true);
        setIsAdmin(token.claims['admin'] === true);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAdmin,
      loading,
      async signInEmail(email: string, password: string) {
        const cred = await signInWithEmailAndPassword(fb.auth, email.trim(), password);
        await cred.user.getIdToken(true);
        const token = await cred.user.getIdTokenResult();
        setIsAdmin(token.claims['admin'] === true);
      },
      async signOutUser() {
        await signOut(fb.auth);
      },
    }),
    [user, isAdmin, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
