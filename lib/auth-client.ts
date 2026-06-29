"use client";

import type { Provider } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "./supabase/client";

const supabase = createSupabaseBrowserClient();
const unsupported = async (feature: string) => ({
  data: null,
  error: { message: `${feature} has not been migrated from Better Auth to Supabase yet.` },
});

export const authClient = {
  getSession: async () => supabase.auth.getSession(),
  signOut: async () => supabase.auth.signOut(),
  signIn: {
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
  },
  signUp: {
    email: async ({ email, password, name }: { email: string; password: string; name: string }) =>
      supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { name },
        },
      }),
  },
  linkSocial: async ({ provider }: { provider: Provider }) =>
    supabase.auth.linkIdentity({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    }),
  requestPasswordReset: async ({ email }: { email: string }) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    }),
  changePassword: async ({ newPassword }: { currentPassword?: string; newPassword: string }) =>
    supabase.auth.updateUser({ password: newPassword }),
  updateUser: async ({ name, image }: { name?: string; image?: string }) =>
    supabase.auth.updateUser({ data: { name, avatar_url: image } }),
  deleteUser: async () => unsupported("Client-side account deletion"),
  twoFactor: {
    disable: async () => unsupported("Two-factor disable"),
    verifyTotp: async () => unsupported("Two-factor verification"),
  },
  passkey: {
    addPasskey: async () => supabase.auth.addPasskey(),
  },
  admin: {
    listUsers: async () => unsupported("Admin user listing"),
  },
};
