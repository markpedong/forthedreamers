import { NextRequest } from 'next/server';
import { z } from 'zod';
import { USER_ROLE } from '@/generated/prisma';
import { upsertAuthUser } from '@/lib/auth';
import { signIn, signOut } from '@/lib/services/auth';
import { errorResponse, successResponse } from '@/lib/server-helper';

const schema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(1).max(128),
  portal: z.enum(['customer', 'dashboard']),
});

export const POST = async (request: NextRequest) => {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return errorResponse('Check your sign-in details', 400);

  let authUser;
  try {
    const auth = await signIn(parsed.data.email, parsed.data.password);
    authUser = auth.user;
  } catch (error) {
    const rateLimited =
      typeof error === 'object' && error !== null && 'status' in error && error.status === 429;
    return errorResponse(
      rateLimited ? 'Too many sign-in attempts. Please try again later.' : 'Invalid email or password',
      rateLimited ? 429 : 401
    );
  }

  try {
    const profile = authUser ? await upsertAuthUser(authUser) : null;
    if (!profile) throw new Error('Missing authenticated profile');

    const allowed =
      parsed.data.portal === 'customer'
        ? profile.role === USER_ROLE.USER
        : profile.role === USER_ROLE.SELLER || profile.role === USER_ROLE.ADMIN;
    if (!allowed) {
      await signOut();
      return errorResponse(
        `You are not authorized to access this page, please use the ${
          parsed.data.portal === 'customer' ? 'dashboard' : 'customer'
        } panel.`,
        403
      );
    }
    return successResponse({
      ...profile,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    });
  } catch {
    await signOut();
    return errorResponse('Unable to sign in. Please try again.', 500);
  }
};
