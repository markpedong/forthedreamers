import { NextRequest } from 'next/server';
import { getSession } from '@/lib/services/auth';
import { successResponse, errorResponse, getPaginatedData } from '@/lib/server-helper';

/**
 * GET /api/orders
 * Get user's orders with pagination.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return errorResponse('Unauthorized');
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    const where: any = { userId: session.user.id };
    if (status) {
      where.status = status;
    }

    const orderBy: any = {};
    orderBy[sortBy] = order;

    const result = await getPaginatedData({
      model: 'order',
      where: { ...where, page, pageSize: limit },
      orderBy,
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true,
          },
        },
        orderGroup: true,
        seller: true,
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
    return errorResponse('Internal server error');
  }
}
