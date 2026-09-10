import { NextRequest } from 'next/server';
import { getCurrentUserID } from '@/lib/auth';
import { successResponse, errorResponse, getPaginatedData } from '@/lib/server-helper';
import { ORDER_STATUS } from '@/generated/prisma';
import { z } from 'zod';

/**
 * GET /api/orders
 * Get user's orders with pagination.
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserID();
    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const parsed = z
      .object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(10),
        status: z.enum(ORDER_STATUS).optional(),
        sortBy: z.enum(['createdAt', 'total', 'status']).default('createdAt'),
        order: z.enum(['asc', 'desc']).default('desc'),
      })
      .safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) return errorResponse('Invalid order filters', 400);
    const { page, limit, status, sortBy, order } = parsed.data;

    const where: { userId: string; status?: ORDER_STATUS } = { userId };
    if (status) {
      where.status = status;
    }

    const result = await getPaginatedData({
      model: 'order',
      where: { ...where, page, pageSize: limit },
      orderBy: [{ [sortBy]: order }, { id: 'asc' }],
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
                reviews: { where: { userId }, select: { id: true } },
              },
            },
            variant: { select: { id: true, name: true } },
          },
        },
        orderGroup: { select: { paymentMethod: true, paymentStatus: true } },
        seller: { select: { storeName: true } },
      },
    });

    return successResponse({
      orders: result.data,
      total: result.total,
      page: result.page,
      limit: result.pageSize,
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return errorResponse('Unable to load orders', 500);
  }
}
