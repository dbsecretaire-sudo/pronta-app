// context/AuthContext.tsx
'use client';
import { Session } from 'next-auth';
import { createContext, ReactNode } from 'react';

interface AuthContextValue {
  accessToken: string | null;
  session: Session | null;
}

const defaultAuthContextValue: AuthContextValue = {
  accessToken: null,
  session: null,
};

export const AuthContext = createContext<AuthContextValue>(defaultAuthContextValue);

// ✅ Provider avec valeurs par défaut
export function AuthProvider({
  children,
  accessToken = null,
  session = null,
}: {
  children: ReactNode;
  accessToken: string | null;
  session: Session | null;
}) {
  return (
    <AuthContext.Provider value={{ accessToken, session }}>
      {children}
    </AuthContext.Provider>
  );
}