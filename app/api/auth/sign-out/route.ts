import { signOut } from '@/lib/services/auth';
import { errorResponse, successResponse } from '@/lib/server-helper';

export const POST = async () => {
  const { error } = await signOut();
  return error
    ? errorResponse(error.message, 400)
    : successResponse();
};
