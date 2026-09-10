import { NextRequest } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/server-helper';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * GET /api/shipping/methods
 * Get available shipping methods (Philippine couriers).
 */
export async function GET() {
  try {
    const methods = await prisma.shippingMethod.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });

    return successResponse({ methods });
  } catch (error) {
    console.error('Get shipping methods error:', error);
    return errorResponse('Internal server error', 400);
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
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return errorResponse('Unauthorized', 400);
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
      return errorResponse('Invalid input data', 400);
    }
    return errorResponse('Internal server error', 400);
  }
}

/**
 * POST /api/shipping/seed
 * Seed default Philippine courier shipping methods (admin only).
 */
const seedSchema = z.object({
  force: z.boolean().optional().default(false),
});

export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return errorResponse('Unauthorized', 400);
    }

    const body = await request.json();
    const { force } = seedSchema.parse(body);

    // If methods already exist, skip unless forced
    const existing = await prisma.shippingMethod.count();
    if (existing > 0 && !force) {
      return successResponse({ message: 'Shipping methods already seeded' }, undefined, 200);
    }

    // Philippine courier defaults (Shopee/Lazada style)
    const defaultMethods = [
      { name: 'Standard Delivery', description: 'J&T Express / Ninja Van — 3–7 days', price: 50, estimatedDays: 3 },
      { name: 'Economy Delivery', description: 'PHL Post / ARI — 7–14 days', price: 30, estimatedDays: 7 },
      { name: 'Express Delivery', description: 'LBC Express / Flash Express — 1–3 days', price: 120, estimatedDays: 1 },
    ];

    await prisma.shippingMethod.deleteMany({});
    const methods = await Promise.all(
      defaultMethods.map(m => prisma.shippingMethod.create({ data: { name: m.name, description: m.description, price: m.price as number, estimatedDays: m.estimatedDays } })),
    );

    return successResponse(methods, 'Shipping methods seeded', 201);
  } catch (error) {
    console.error('Seed shipping methods error:', error);
    return errorResponse('Internal server error', 400);
  }
}
