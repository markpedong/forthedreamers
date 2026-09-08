'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from './client';
import { getCurrentUser, signOut as signOutRequest } from '@/lib/http';
import { clearUserData, setUserData } from '@/redux/reducers/userData';
import { useAppDispatch } from '@/redux/store';
import { useMutation, useQuery } from '@tanstack/react-query';

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
  if (context === undefined) throw new Error('useAuthSession must be used within an AuthProvider');
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
  initialSession?: AuthSession | null;
};

export const AuthProvider = ({ children, initialSession }: AuthProviderProps) => {
  const [session, setSession] = useState<AuthSession | null>(initialSession ?? null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userQuery = useQuery({
    queryKey: ['current-user', session?.user?.id],
    queryFn: getCurrentUser,
    enabled: Boolean(session?.user?.id),
    select: result => result.data,
    retry: false,
  });
  const signOutMutation = useMutation({ mutationFn: signOutRequest });

  useEffect(() => {
    if (userQuery.data && userQuery.data.id === session?.user?.id) dispatch(setUserData(userQuery.data));
    else if (userQuery.isError) dispatch(clearUserData());
  }, [dispatch, session?.user?.id, userQuery.data, userQuery.isError]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      const metadata = currentSession?.user.user_metadata;

      setSession(previousSession =>
        currentSession
          ? {
              user: {
                ...currentSession.user,
                ...(previousSession?.user?.id === currentSession.user.id ? previousSession.user : {}),
                name:
                  (typeof metadata?.name === 'string' && metadata.name) ||
                  (typeof metadata?.full_name === 'string' && metadata.full_name) ||
                  previousSession?.user?.name,
                image:
                  (typeof metadata?.avatar_url === 'string' && metadata.avatar_url) || previousSession?.user?.image,
              },
              session: { token: currentSession.access_token, impersonatedBy: null },
            }
          : null
      );

      if (!currentSession) {
        dispatch(clearUserData());
        return;
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  const signOut = async () => {
    dispatch(clearUserData());
    setSession(null);

    try {
      await signOutMutation.mutateAsync();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      router.replace('/sign-in');
    }
  };

  return <AuthContext.Provider value={{ session, signOut }}>{children}</AuthContext.Provider>;
};
