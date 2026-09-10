import { getSessionUser } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/services/auth';
import { errorResponse, successResponse } from '@/lib/server-helper';

export const POST = async () => {
  const user = await getSessionUser();
  if (!user?.email) return errorResponse('Unauthorized', 401);
  try {
    await sendVerificationEmail(user.email);
    return successResponse();
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to send verification email', 400);
  }
};
