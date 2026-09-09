import { signOut } from '@/lib/services/auth';
import { errorResponse, successResponse } from '@/lib/server-helper';

export const POST = async () => {
  const { error } = await signOut();
  return error ? errorResponse('Unable to sign out. Please try again.', 500) : successResponse();
};
