import { NextRequest } from 'next/server';
import { getCurrentUserID } from '@/lib/auth';
import { errorResponse, successResponse } from '@/lib/server-helper';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserID();
  if (!userId) return errorResponse('Unauthorized', 401);
  const parsed = z.string().min(1).max(100).safeParse((await params).id);
  if (!parsed.success) return errorResponse('Invalid ticket', 400);

  try {
    const ticket = await prisma.supportTicket.findFirst({
      where: { id: parsed.data, userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!ticket) return errorResponse('Support ticket not found', 404);
    return successResponse(ticket);
  } catch (error) {
    console.error('Get support ticket error:', error);
    return errorResponse('Unable to load support ticket', 500);
  }
}
