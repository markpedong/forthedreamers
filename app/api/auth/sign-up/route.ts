import { NextRequest } from 'next/server';
import { z } from 'zod';
import { displayNameSchema, isUsernameAvailable, usernameSchema, UsernameTakenError } from '@/lib/services/auth';
import { signUp } from '@/lib/services/auth';
import { errorResponse, successResponse } from '@/lib/server-helper';

const schema = z.object({
  username: usernameSchema,
  displayName: displayNameSchema.optional(),
  email: z.email(),
  password: z.string().min(8).max(128),
});

const USERNAME_QUERY = z.object({ username: usernameSchema });

export const GET = async (request: NextRequest) => {
  const parsed = USERNAME_QUERY.safeParse({ username: request.nextUrl.searchParams.get('username') ?? '' });
  if (!parsed.success) return successResponse({ available: false });
  return successResponse({ available: await isUsernameAvailable(parsed.data.username) });
};

export const POST = async (request: NextRequest) => {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const usernameIssue = parsed.error.issues.find(issue => issue.path[0] === 'username');
    return errorResponse(usernameIssue?.message ?? 'Check your signup details', 400);
  }
  try {
    await signUp(parsed.data.email, parsed.data.password, parsed.data.username, parsed.data.displayName);
    return successResponse(undefined, 'Account created successfully!');
  } catch (error) {
    if (error instanceof UsernameTakenError) return errorResponse(error.message, 409);
    return errorResponse(error instanceof Error ? error.message : 'Unable to sign up', 400);
  }
};
