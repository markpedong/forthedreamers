import { NextRequest } from 'next/server';
import { z } from 'zod';
import { USER_ROLE } from '@/generated/prisma';
import { getSession } from '@/lib/services/auth';
import { setProductStatus } from '@/lib/services/admin-catalog';
import { errorResponse, successResponse } from '@/lib/server-helper';

const schema = z.object({ id: z.string().min(1).max(100), active: z.boolean() });

export const PATCH = async (request: NextRequest) => {
  const session = await getSession();
  if (!session || (session.user.role !== USER_ROLE.ADMIN && session.user.role !== USER_ROLE.SELLER)) {
    return errorResponse('Forbidden', 403);
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return errorResponse('Invalid product status', 400);
  try {
    return successResponse(await setProductStatus(parsed.data.id, parsed.data.active));
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to update status', 400);
  }
};
