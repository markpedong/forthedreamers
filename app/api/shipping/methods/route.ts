import { NextRequest } from 'next/server';
import { getSession } from '@/lib/services/auth';
import { successResponse, errorResponse } from '@/lib/server-helper';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * GET /api/shipping/methods
 * Get available shipping methods.
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized');
    }

    const methods = await prisma.shippingMethod.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });

    return successResponse({ methods });
  } catch (error) {
    console.error('Get shipping methods error:', error);
    return errorResponse('Internal server error');
  }
}

/**
 * POST /api/shipping/methods
 * Create a new shipping method (admin only).
 */
const shippingMethodSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.number().min(0),
  estimatedDays: z.number().min(1),
  isActive: z.boolean().optional().default(true),
  regions: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return errorResponse('Unauthorized');
    }

    const body = await request.json();
    const validated = shippingMethodSchema.parse(body);

    const method = await prisma.shippingMethod.create({
      data: validated,
    });

    return successResponse(method, 'Shipping method created', 201);
  } catch (error) {
    console.error('Create shipping method error:', error);
    if (error instanceof z.ZodError) {
      return errorResponse('Invalid input data');
    }
    return errorResponse('Internal server error');
  }
}
