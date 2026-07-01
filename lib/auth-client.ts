"use client";

import type { Provider } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "./supabase/client";

const supabase = createSupabaseBrowserClient();
const unsupported = async (feature: string) => ({
  data: null,
  error: { message: `${feature} is not supported by the Supabase auth setup yet.` },
});

export const authClient = {
  getSession: async () => supabase.auth.getSession(),
  signOut: async () => supabase.auth.signOut(),
  signIn: {
    email: async ({ email, password }: { email: string; password: string }) =>
      supabase.auth.signInWithPassword({ email, password }),
    passkey: async (..._args: unknown[]) => supabase.auth.signInWithPasskey(),
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
  linkSocial: async ({ provider, callbackURL }: { provider: string; callbackURL?: string }) =>
    supabase.auth.linkIdentity({
      provider: provider as Provider,
      options: { redirectTo: `${window.location.origin}${callbackURL ?? "/auth/callback"}` },
    }),
  requestPasswordReset: async ({ email, redirectTo }: { email: string; redirectTo?: string }) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${redirectTo ?? "/reset-password"}`,
    }),
  changePassword: async ({ newPassword }: { currentPassword?: string; newPassword: string }) =>
    supabase.auth.updateUser({ password: newPassword }),
  updateUser: async ({ name, image }: { name?: string; image?: string }) =>
    supabase.auth.updateUser({ data: { name, avatar_url: image } }),
  deleteUser: async () => unsupported("Client-side account deletion"),
  twoFactor: {
    disable: async (..._args: unknown[]) => unsupported("Two-factor disable"),
    verifyTotp: async (..._args: unknown[]) => unsupported("Two-factor verification"),
  },
  passkey: {
    addPasskey: async (_options?: unknown) => unsupported("Passkey registration"),
  },
  admin: {
    listUsers: async () => unsupported("Admin user listing"),
  },
};
