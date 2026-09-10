import { NextRequest } from 'next/server';
import { getCurrentUserID } from '@/lib/auth';
import { errorResponse, successResponse } from '@/lib/server-helper';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const messageSchema = z.object({ message: z.string().trim().min(10).max(2000) });

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getCurrentUserID();
  if (!userId) return errorResponse('Unauthorized', 401);
  const id = z.string().min(1).max(100).safeParse((await params).id);
  const body = messageSchema.safeParse(await request.json().catch(() => null));
  if (!id.success || !body.success) return errorResponse('Invalid message', 400);

  try {
    const ticket = await prisma.supportTicket.findFirst({
      where: { id: id.data, userId, status: { notIn: ['CLOSED', 'CANCELLED'] } },
      select: { id: true },
    });
    if (!ticket) return errorResponse('Open support ticket not found', 404);

    const message = await prisma.$transaction(async tx => {
      return tx.supportMessage.create({
        data: { ticketId: id.data, userId, message: body.data.message, isStaff: false },
      });
    });
    return successResponse(message, 'Message sent', 201);
  } catch (error) {
    console.error('Add support message error:', error);
    return errorResponse('Unable to send message', 500);
  }
}
