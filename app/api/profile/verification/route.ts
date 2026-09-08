import { getSession, sendVerificationEmail } from '@/lib/services/auth';
import { errorResponse, successResponse } from '@/lib/server-helper';

export const POST = async () => {
  const session = await getSession();
  if (!session?.user.email) return errorResponse('Unauthorized', 401);
  try {
    await sendVerificationEmail(session.user.email);
    return successResponse();
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to send verification email', 400);
  }
};
