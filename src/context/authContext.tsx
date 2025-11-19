// context/AuthContext.tsx
'use client';
import { Session } from 'next-auth';
import { createContext, ReactNode } from 'react';

// ✅ Contexte exporté
export const AuthContext = createContext<{} | string | null>(null);

// ✅ Composant client pour le Provider
export function AuthProvider({
  children,
  accessToken = "",
  session = {accessToken:"", user:{id:'', email: ""}, expires: ''}
}: {
  children: ReactNode;
  accessToken: {} | string | null;
  session: Session | null;
}) {
  return (
    <AuthContext.Provider value={{accessToken, session}}>
      {children}
    </AuthContext.Provider>
  );
}