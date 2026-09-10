import { NextRequest } from 'next/server';
import { getCurrentUserID } from '@/lib/auth';
import { successResponse, errorResponse, getPaginatedData } from '@/lib/server-helper';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const listSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED', 'CANCELLED']).optional(),
});

const ticketSchema = z.object({
  subject: z.string().trim().min(5).max(200),
  message: z.string().trim().min(10).max(2000),
  category: z.enum(['ORDER', 'PRODUCT', 'SHIPPING', 'ACCOUNT', 'OTHER']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional().default('MEDIUM'),
  orderId: z.string().max(100).optional(),
  productId: z.string().max(100).optional(),
});

export async function GET(request: NextRequest) {
  const userId = await getCurrentUserID();
  if (!userId) return errorResponse('Unauthorized', 401);
  const parsed = listSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return errorResponse('Invalid ticket filters', 400);

  try {
    const { page, limit, status } = parsed.data;
    const result = await getPaginatedData({
      model: 'supportTicket',
      where: { userId, ...(status && { status }), page, pageSize: limit },
      orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }],
    });
    return successResponse({ tickets: result.data, total: result.total, page: result.page, limit: result.pageSize });
  } catch (error) {
    console.error('Get support tickets error:', error);
    return errorResponse('Unable to load support tickets', 500);
  }
}

export async function POST(request: NextRequest) {
  const userId = await getCurrentUserID();
  if (!userId) return errorResponse('Unauthorized', 401);
  const parsed = ticketSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return errorResponse('Invalid ticket details', 400);

  try {
    const ticket = await prisma.supportTicket.create({
      data: { userId, ...parsed.data },
    });
    return successResponse(ticket, 'Support ticket created', 201);
  } catch (error) {
    console.error('Create support ticket error:', error);
    return errorResponse('Unable to create support ticket', 500);
  }
}
