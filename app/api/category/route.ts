import { NextRequest } from 'next/server';
import { z } from 'zod';
import { USER_ROLE } from '@/generated/prisma';
import { getSessionUser } from '@/lib/auth';
import { publicCategories } from '@/lib/services/catalog';
import { saveCategory } from '@/lib/services/admin-catalog';
import { errorResponse, successResponse } from '@/lib/server-helper';

const schema = z.object({ id: z.string().min(1).max(100).optional(), name: z.string().trim().min(1).max(100) });
const isAdmin = async () => (await getSessionUser())?.role === USER_ROLE.ADMIN;

export const GET = async () => successResponse(await publicCategories());

const save = async (request: NextRequest, editing: boolean) => {
  if (!(await isAdmin())) return errorResponse('Forbidden', 403);
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || (editing && !parsed.data.id))
    return errorResponse('Invalid category', 400);
  try {
    return successResponse(await saveCategory(parsed.data.name, parsed.data.id), 'Saved successfully');
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to save category', 400);
  }
};

export const POST = (request: NextRequest) => save(request, false);
export const PUT = (request: NextRequest) => save(request, true);
