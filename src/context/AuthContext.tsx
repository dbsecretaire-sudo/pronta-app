// context/AuthContext.tsx
'use client';

import { useAuthCheck } from "@/src/Hook/useAuthCheck";
import { createContext, useContext, ReactNode } from 'react';

type AuthContextType = {
  session: any;
  status: string;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children, initialSession }: { children: ReactNode; initialSession: any }) {
  const { data: session, status } = useAuthCheck();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" || !!initialSession;
  const currentSession = session || initialSession;

  return (
    <AuthContext.Provider value={{ session: currentSession, status, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
