import { getSession } from '@/lib/services/auth';
import { checkout } from '@/lib/services/checkout';
import { errorResponse, successResponse } from '@/lib/server-helper';

export const POST = async () => {
  const session = await getSession();
  if (!session) return errorResponse('Please sign in', 401);
  try {
    return successResponse(await checkout(session.user.id), 'Order confirmed');
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Failed to place order', 400);
  }
};
