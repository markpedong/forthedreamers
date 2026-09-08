import { NextRequest } from 'next/server';
import { getSession } from '@/lib/services/auth';
import { errorResponse, successResponse } from '@/lib/server-helper';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const messageSchema = z.object({ message: z.string().trim().min(10).max(2000) });

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.user) return errorResponse('Unauthorized', 401);
  const id = z.string().min(1).max(100).safeParse((await params).id);
  const body = messageSchema.safeParse(await request.json().catch(() => null));
  if (!id.success || !body.success) return errorResponse('Invalid message', 400);

  try {
    const ticket = await prisma.supportTicket.findFirst({
      where: { id: id.data, userId: session.user.id, status: { notIn: ['CLOSED', 'CANCELLED'] } },
      select: { id: true },
    });
    if (!ticket) return errorResponse('Open support ticket not found', 404);

    const message = await prisma.$transaction(async tx => {
      const created = await tx.supportMessage.create({
        data: { ticketId: id.data, userId: session.user.id, message: body.data.message, isStaff: false },
      });
      await tx.supportTicket.update({ where: { id: id.data }, data: { updatedAt: new Date() } });
      return created;
    });
    return successResponse(message, 'Message sent', 201);
  } catch (error) {
    console.error('Add support message error:', error);
    return errorResponse('Unable to send message', 500);
  }
}
