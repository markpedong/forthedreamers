"use client";

import type { Provider } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "./supabase/client";

const supabase = createSupabaseBrowserClient();

/**
 * Direct Supabase Auth client — replaces the old Better Auth compatibility shim.
 * All methods map 1:1 to Supabase auth operations.
 */

export const linkSocial = async ({ provider, callbackURL }: { provider: string; callbackURL?: string }) =>
  supabase.auth.linkIdentity({
    provider: provider as Provider,
    options: { redirectTo: `${window.location.origin}${callbackURL ?? "/auth/callback"}` },
  });

export const requestPasswordReset = async ({ email, redirectTo }: { email: string; redirectTo?: string }) =>
  supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}${redirectTo ?? "/reset-password"}`,
  });

// Two-factor — not natively supported by Supabase. These are no-ops.
export const twoFactor = {
  disable: async (..._args: unknown[]) => ({ data: null, error: { message: "Two-factor is not supported by Supabase Auth." } }),
  verifyTotp: async (..._args: unknown[]) => ({ data: null, error: { message: "Two-factor is not supported by Supabase Auth." } }),
};

// Passkeys — not natively supported by Supabase. These are no-ops.
export const passkey = {
  addPasskey: async (_options?: unknown) => ({ data: null, error: { message: "Passkey registration is not supported by Supabase Auth." } }),
};
