import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/services/auth';
import { errorResponse, successResponse } from '@/lib/server-helper';

const schema = z.object({ email: z.string().trim().toLowerCase().pipe(z.email()) });

export const POST = async (request: Request) => {
  const user = await getSessionUser();
  const parsed = schema.safeParse(await request.json().catch(() => null));
  const email = user?.email ?? (parsed.success ? parsed.data.email : null);
  if (!email) return errorResponse('Check your email address', 400);
  try {
    await sendVerificationEmail(email);
    return successResponse();
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to send verification email', 400);
  }
};
