'use client';

// Two-factor — not natively supported by Supabase. These are no-ops.
export const twoFactor = {
  disable: async (...args: unknown[]) => {
    void args;
    return { data: null, error: { message: 'Two-factor is not supported by Supabase Auth.' } };
  },
  verifyTotp: async (...args: unknown[]) => {
    void args;
    return { data: null, error: { message: 'Two-factor is not supported by Supabase Auth.' } };
  },
};

// Passkeys — not natively supported by Supabase. These are no-ops.
export const passkey = {
  addPasskey: async (options?: unknown) => {
    void options;
    return { data: null, error: { message: 'Passkey registration is not supported by Supabase Auth.' } };
  },
};
