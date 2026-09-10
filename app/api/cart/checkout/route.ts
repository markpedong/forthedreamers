import { NextRequest } from 'next/server';
import { getCurrentUserID } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/server-helper';
import { checkout } from '@/lib/services/checkout';
import { z } from 'zod';
import { COURIER_CODES } from '@/constants/shipping';

const checkoutSchema = z.object({
  addressId: z.string().min(1),
  cartItemIds: z.array(z.string().min(1)).min(1).max(100),
  paymentMethod: z.string().min(1),
  shipments: z
    .array(z.object({ sellerId: z.string().min(1), courierCode: z.enum(COURIER_CODES) }))
    .min(1)
    .max(100),
});

/**
 * POST /api/cart/checkout
 * Place a cash-on-delivery order.
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserID();
    if (!userId) return errorResponse('Unauthorized', 401);

    const input = checkoutSchema.safeParse(await request.json());
    if (!input.success) return errorResponse('Check the address, cart items, shipping choices, and payment method', 400);

    return successResponse(await checkout(userId, input.data), 'Order placed');
  } catch (error) {
    console.error('Checkout error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return errorResponse(message, 400);
  }
}
