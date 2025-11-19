// context/AuthContext.tsx
'use client';
import { Session } from 'next-auth';
import { createContext, ReactNode } from 'react';

// ✅ Contexte exporté
export const AuthContext = createContext< string | null>(null);

// ✅ Composant client pour le Provider
export function AuthProvider({
  children,
  accessToken = "",
}: {
  children: ReactNode;
  accessToken: string | null;
}) {
  return (
    <AuthContext.Provider value={accessToken}>
      {children}
    </AuthContext.Provider>
  );
}