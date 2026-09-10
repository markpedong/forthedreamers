import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getCurrentUserID } from '@/lib/auth';
import { CartError, mutateCart, readCart, readCartCount } from '@/lib/services/cart';
import { errorResponse, successResponse } from '@/lib/server-helper';

const mutationSchema = z.object({
  id: z.string().min(1).max(100),
  quantity: z.number().int().min(1).max(999).optional(),
});
const message = (operation: 'add' | 'update' | 'remove') =>
  operation === 'add' ? 'Added to cart' : operation === 'remove' ? 'Removed from cart' : 'Cart updated';

const change = async (userId: string, operation: 'add' | 'update' | 'remove', input: unknown) => {
  const parsed = mutationSchema.safeParse(input);
  if (!parsed.success || (operation !== 'remove' && parsed.data.quantity === undefined)) {
    return errorResponse('Invalid cart input', 400);
  }
  try {
    const data = await mutateCart(userId, operation, parsed.data.id, parsed.data.quantity);
    return successResponse(data, message(operation));
  } catch (error) {
    return errorResponse(
      error instanceof CartError ? error.message : 'Unable to update cart. Please try again.',
      400
    );
  }
};

export const GET = async (request: NextRequest) => {
  const userId = await getCurrentUserID();
  if (!userId) return errorResponse('Unauthorized', 401);
  const data =
    request.nextUrl.searchParams.get('summary') === 'count'
      ? { count: await readCartCount(userId) }
      : await readCart(userId);
  return successResponse(data);
};

export const POST = async (request: NextRequest) => {
  const userId = await getCurrentUserID();
  if (!userId) return errorResponse('Please sign in first', 401);
  const body = await request.json().catch(() => null);
  return change(userId, 'add', body && { id: body.variantId, quantity: body.quantity ?? 1 });
};

export const PUT = async (request: NextRequest) => {
  const userId = await getCurrentUserID();
  if (!userId) return errorResponse('Please sign in first', 401);
  const body = await request.json().catch(() => null);
  return change(userId, 'update', body && { id: body.cartItemId, quantity: body.quantity });
};

export const DELETE = async (request: NextRequest) => {
  const userId = await getCurrentUserID();
  if (!userId) return errorResponse('Please sign in first', 401);
  return change(userId, 'remove', { id: request.nextUrl.searchParams.get('id') });
};
