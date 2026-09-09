import 'server-only';

import { cache } from 'react';
import { headers } from 'next/headers';
import type { Provider } from '@supabase/supabase-js';
import prisma from '@/lib/prisma';
import { getRandomDefaultAvatarUrl } from '@/lib/default-avatars';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionClaims, getSessionUser } from '@/lib/auth';
import type { TUserData } from '@/services/types';

const appOrigin = async () => {
  const headerStore = await headers();
  const proto = headerStore.get('x-forwarded-proto') ?? 'http';
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host');
  return process.env.NEXT_PUBLIC_APP_URL || (host ? `${proto}://${host}` : '');
};

export const getSession = cache(async () => {
  const [claims, profile] = await Promise.all([getSessionClaims(), getSessionUser()]);
  if (!claims || !profile) return null;

  return {
    hasPassword:
      claims.app_metadata?.provider === 'email' ||
      (Array.isArray(claims.app_metadata?.providers) && claims.app_metadata.providers.includes('email')),
    user: profile,
    session: { token: claims.session_id, impersonatedBy: null as string | null },
  };
});

export const getCurrentUserData = async (): Promise<TUserData | null> => {
  const session = await getSession();
  if (!session) return null;
  return {
    ...session.user,
    email: session.user.email ?? '',
    createdAt: new Date(session.user.createdAt).toISOString(),
    updatedAt: new Date(session.user.updatedAt).toISOString(),
  };
};

export const signUp = async (email: string, password: string, name: string, callbackURL = '/profile') => {
  const supabase = await createSupabaseServerClient();
  const origin = await appOrigin();
  const image = getRandomDefaultAvatarUrl();
  const result = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback?next=${callbackURL}`, data: { name, avatar_url: image } },
  });
  if (result.error) throw new Error(result.error.message);
  if (result.data.user?.email) {
    await prisma.user.upsert({
      where: { id: result.data.user.id },
      update: { email: result.data.user.email, name },
      create: {
        id: result.data.user.id,
        email: result.data.user.email,
        name,
        image,
        emailVerified: Boolean(result.data.user.email_confirmed_at),
      },
    });
  }
  return result.data;
};

export const signIn = async (email: string, password: string) => {
  const supabase = await createSupabaseServerClient();
  const result = await supabase.auth.signInWithPassword({ email, password });
  if (result.error) throw result.error;
  return result.data;
};

export const signOut = async () => (await createSupabaseServerClient()).auth.signOut();

export const socialSignInUrl = async (provider: Provider, next: '/profile' | '/dashboard') => {
  const supabase = await createSupabaseServerClient();
  const origin = await appOrigin();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`, skipBrowserRedirect: true },
  });
  if (error || !data.url) throw new Error(error?.message ?? 'Unable to start social sign in');
  return data.url;
};

export const socialLinkUrl = async (provider: Provider, next: string) => {
  const supabase = await createSupabaseServerClient();
  const origin = await appOrigin();
  const { data, error } = await supabase.auth.linkIdentity({
    provider,
    options: { redirectTo: `${origin}${next}`, skipBrowserRedirect: true },
  });
  if (error || !data.url) throw new Error(error?.message ?? 'Unable to link account');
  return data.url;
};

export const sendVerificationEmail = async (email: string) => {
  const supabase = await createSupabaseServerClient();
  const origin = await appOrigin();
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: `${origin}/auth/callback?next=/profile` },
  });
  if (error) throw new Error(error.message);
};

export const sendForgotPasswordEmail = async (email: string, redirectTo = '/reset-password') => {
  const supabase = await createSupabaseServerClient();
  const origin = await appOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}${redirectTo}` });
  if (error) throw new Error(error.message);
};

export const resetPassword = async (token: string, newPassword: string) => {
  const supabase = await createSupabaseServerClient();
  const { error: verifyError } = await supabase.auth.verifyOtp({ email: '', token, type: 'recovery' });
  if (verifyError) throw new Error('Invalid or expired reset token');
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
};

export const changePassword = async (newPassword: string) => {
  const { error } = await (await createSupabaseServerClient()).auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
};

export const updateUser = async (userId: string, name: string) => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.updateUser({ data: { name } });
  if (error || !user || user.id !== userId) throw new Error(error?.message ?? 'Authentication required');
  await prisma.user.update({ where: { id: userId }, data: { name } });
  return getCurrentUserData();
};

export const updateUserImage = async (userId: string, image: string) => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.updateUser({ data: { avatar_url: image } });
  if (error || !user || user.id !== userId) throw new Error(error?.message ?? 'Authentication required');
  await prisma.user.update({ where: { id: userId }, data: { image } });
  return getCurrentUserData();
};

export const listAllSessions = async () => {
  const claims = await getSessionClaims();
  if (!claims) return [];
  const headerStore = await headers();
  const forwardedFor = headerStore.get('x-forwarded-for');
  return [
    {
      id: claims.session_id,
      token: claims.session_id,
      userAgent: headerStore.get('user-agent'),
      ipAddress: forwardedFor?.split(',')[0]?.trim() ?? headerStore.get('x-real-ip'),
      createdAt: new Date(claims.iat * 1000),
    },
  ];
};
