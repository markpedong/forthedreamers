'use client';

import { createBrowserClient } from '@supabase/ssr';

export const createSupabaseBrowserClient = () => {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: {
      experimental: {
        passkey: true,
      },
    },
  });
};
