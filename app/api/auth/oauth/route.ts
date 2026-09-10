import { NextRequest } from 'next/server';
import { z } from 'zod';
import { socialSignInUrl } from '@/lib/services/auth';
import { errorResponse, successResponse } from '@/lib/server-helper';

const schema = z.object({ provider: z.enum(['google', 'facebook']), next: z.enum(['/profile', '/dashboard']) });

export const POST = async (request: NextRequest) => {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return errorResponse('Invalid social sign-in request', 400);
  try {
    return successResponse({ url: await socialSignInUrl(parsed.data.provider, parsed.data.next) });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to start social sign in', 400);
  }
};
