"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session as SupabaseSession, User } from '@supabase/supabase-js';
import { createSupabaseBrowserClient } from './client';

type SessionUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role?: string | null;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type AuthSession = {
  user: SessionUser | null;
  session?: { token?: string; impersonatedBy?: string | null } | null;
};

type AuthContextType = {
  session: AuthSession | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthSession = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthSession must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
  initialSession?: AuthSession | null;
};

export const AuthProvider = ({ children, initialSession }: AuthProviderProps) => {
  const [session, setSession] = useState<AuthSession | null>(initialSession ?? null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    // Set initial session from props (passed by Server Component)
    if (initialSession) {
      setSession(initialSession);
    }

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (currentSession) {
        setSession({ user: currentSession.user, session: { token: currentSession.access_token, impersonatedBy: null } });
      } else {
        setSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [initialSession]);

  const signOut = async () => {
    const supabase = createSupabaseBrowserClient();
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
