import { NextRequest } from 'next/server';
import { z } from 'zod';
import { signUp } from '@/lib/services/auth';
import { errorResponse, successResponse } from '@/lib/server-helper';

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email(),
  password: z.string().min(8).max(128),
});

export const POST = async (request: NextRequest) => {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return errorResponse('Check your signup details', 400);
  try {
    await signUp(parsed.data.email, parsed.data.password, parsed.data.name);
    return successResponse(undefined, 'Account created successfully!');
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to sign up', 400);
  }
};
