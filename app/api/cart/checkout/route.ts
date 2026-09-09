import { NextRequest } from 'next/server';
import { getSession } from '@/lib/services/auth';
import { successResponse, errorResponse } from '@/lib/server-helper';
import { prisma } from '@/lib/prisma';
import { checkout } from '@/lib/services/checkout';

/**
 * POST /api/cart/checkout
 * Place order with optional shipping method.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const shippingMethodId = typeof body?.shippingMethodId === 'string' ? body.shippingMethodId : undefined;

    return successResponse(await checkout(session.user.id, shippingMethodId), 'Order confirmed');
  } catch (error) {
    console.error('Checkout error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return errorResponse(message, 400);
  }
}
