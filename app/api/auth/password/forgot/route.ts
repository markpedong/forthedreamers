import { NextRequest } from 'next/server';
import { z } from 'zod';
import { sendForgotPasswordEmail } from '@/lib/services/auth';
import { errorResponse, successResponse } from '@/lib/server-helper';

const schema = z.object({ email: z.email(), redirectTo: z.string().startsWith('/').optional() });

export const POST = async (request: NextRequest) => {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return errorResponse('Enter a valid email', 400);
  try {
    await sendForgotPasswordEmail(parsed.data.email, parsed.data.redirectTo);
    return successResponse();
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to send reset email', 400);
  }
};
