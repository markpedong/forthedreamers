import { NextRequest } from 'next/server';
import { z } from 'zod';
import { changePassword, getSession } from '@/lib/services/auth';
import { errorResponse, successResponse } from '@/lib/server-helper';

const schema = z.object({ password: z.string().min(8).max(128) });

export const PATCH = async (request: NextRequest) => {
  if (!(await getSession())) return errorResponse('Unauthorized', 401);
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return errorResponse('Invalid password', 400);
  try {
    await changePassword(parsed.data.password);
    return successResponse();
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to change password', 400);
  }
};
