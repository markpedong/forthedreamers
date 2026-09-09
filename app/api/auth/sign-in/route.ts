import { NextRequest } from 'next/server';
import { z } from 'zod';
import { USER_ROLE } from '@/generated/prisma';
import { getSession, signIn, signOut } from '@/lib/services/auth';
import { errorResponse, successResponse } from '@/lib/server-helper';

const schema = z.object({
  email: z.email(),
  password: z.string().min(1),
  portal: z.enum(['customer', 'dashboard']),
});

export const POST = async (request: NextRequest) => {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return errorResponse('Check your sign-in details', 400);
  try {
    await signIn(parsed.data.email, parsed.data.password);
    const session = await getSession();
    if (!session) throw new Error('Unable to sign in. Please try again.');
    const allowed =
      parsed.data.portal === 'customer'
        ? session.user.role === USER_ROLE.USER
        : session.user.role === USER_ROLE.SELLER || session.user.role === USER_ROLE.ADMIN;
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
      ...session.user,
      email: session.user.email ?? '',
      createdAt: new Date(session.user.createdAt).toISOString(),
      updatedAt: new Date(session.user.updatedAt).toISOString(),
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to sign in', 400);
  }
};
