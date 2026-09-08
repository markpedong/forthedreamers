import { getCurrentUserData } from '@/lib/services/auth';
import { errorResponse, successResponse } from '@/lib/server-helper';

export const GET = async () => {
  const user = await getCurrentUserData();
  return user
    ? successResponse(user)
    : errorResponse('Unauthorized', 401);
};
