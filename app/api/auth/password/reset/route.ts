import { NextRequest } from 'next/server';
import { z } from 'zod';
import { resetPassword } from '@/lib/services/auth';
import { errorResponse, successResponse } from '@/lib/server-helper';

const schema = z.object({ token: z.string().trim().min(1), password: z.string().min(8).max(128) });

export const PUT = async (request: NextRequest) => {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return errorResponse('Invalid password reset request', 400);
  try {
    await resetPassword(parsed.data.token, parsed.data.password);
    return successResponse();
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to reset password', 400);
  }
};
