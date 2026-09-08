import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession, updateUser, updateUserImage } from '@/lib/services/auth';
import { errorResponse, successResponse } from '@/lib/server-helper';

const schema = z.union([
  z.object({ name: z.string().trim().min(1).max(100) }),
  z.object({ image: z.string().startsWith('data:image/').max(5_000_000) }),
]);

export const PATCH = async (request: NextRequest) => {
  const session = await getSession();
  if (!session) return errorResponse('Unauthorized', 401);
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return errorResponse('Invalid profile update', 400);
  try {
    const user =
      'name' in parsed.data
        ? await updateUser(session.user.id, parsed.data.name)
        : await updateUserImage(session.user.id, parsed.data.image);
    return successResponse({ user });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to update profile', 400);
  }
};
