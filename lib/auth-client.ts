"use client";

import type { Provider } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "./supabase/client";

const supabase = createSupabaseBrowserClient();

/**
 * Direct Supabase Auth client — replaces the old Better Auth compatibility shim.
 * All methods map 1:1 to Supabase auth operations.
 */

export const getSession = async () => {
  return supabase.auth.getSession();
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const authSignIn = {
  email: async ({ email, password }: { email: string; password: string }) =>
    supabase.auth.signInWithPassword({ email, password }),

  passkey: async () => supabase.auth.signInWithPasskey(),

  social: async ({ provider, callbackURL }: { provider: Provider; callbackURL?: string }) =>
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}${callbackURL ?? "/auth/callback"}`,
      },
    }),
};

export const authSignUp = {
  email: async ({ email, password, name }: { email: string; password: string; name: string }) =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { name },
      },
    }),
};

export const linkSocial = async ({ provider, callbackURL }: { provider: string; callbackURL?: string }) =>
  supabase.auth.linkIdentity({
    provider: provider as Provider,
    options: { redirectTo: `${window.location.origin}${callbackURL ?? "/auth/callback"}` },
  });

export const requestPasswordReset = async ({ email, redirectTo }: { email: string; redirectTo?: string }) =>
  supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}${redirectTo ?? "/reset-password"}`,
  });

export const changePassword = async ({ newPassword }: { currentPassword?: string; newPassword: string }) =>
  supabase.auth.updateUser({ password: newPassword });

export const updateUser = async ({ name, image }: { name?: string; image?: string }) =>
  supabase.auth.updateUser({ data: { name, avatar_url: image } });

export const deleteUser = async () => {
  // Supabase doesn't support client-side account deletion directly.
  // Use admin API or contact support.
  throw new Error("Client-side account deletion is not supported by Supabase Auth.");
};

// Two-factor — not natively supported by Supabase. These are no-ops.
export const twoFactor = {
  disable: async (..._args: unknown[]) => ({ data: null, error: { message: "Two-factor is not supported by Supabase Auth." } }),
  verifyTotp: async (..._args: unknown[]) => ({ data: null, error: { message: "Two-factor is not supported by Supabase Auth." } }),
};

// Passkeys — not natively supported by Supabase. These are no-ops.
export const passkey = {
  addPasskey: async (_options?: unknown) => ({ data: null, error: { message: "Passkey registration is not supported by Supabase Auth." } }),
};

// Admin — use admin API directly. These are no-ops.
export const admin = {
  listUsers: async () => ({ data: null, error: { message: "Admin user listing is not supported by the client-side Supabase auth setup." } }),
};
