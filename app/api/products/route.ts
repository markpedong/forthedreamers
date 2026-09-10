import { NextRequest } from 'next/server';
import { z } from 'zod';
import { USER_ROLE } from '@/generated/prisma';
import { getSessionUser } from '@/lib/auth';
import { adminProducts, deleteProduct, productSchema, saveProduct } from '@/lib/services/admin-catalog';
import { errorResponse, successResponse } from '@/lib/server-helper';

const hasCatalogAccess = async () => {
  const user = await getSessionUser();
  return user && (user.role === USER_ROLE.ADMIN || user.role === USER_ROLE.SELLER);
};

export const GET = async () => {
  if (!(await hasCatalogAccess())) return errorResponse('Forbidden', 403);
  return successResponse(await adminProducts());
};

const save = async (request: NextRequest, editing: boolean) => {
  const parsed = productSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || (editing && !parsed.data.id))
    return errorResponse('Invalid product', 400);
  try {
    return successResponse(await saveProduct(parsed.data, editing), 'Saved successfully');
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to save product', 400);
  }
};

export const POST = (request: NextRequest) => save(request, false);
export const PUT = (request: NextRequest) => save(request, true);

export const DELETE = async (request: NextRequest) => {
  if (!(await hasCatalogAccess())) return errorResponse('Forbidden', 403);
  const parsed = z.object({ id: z.string().min(1).max(100) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return errorResponse('Invalid product', 400);
  try {
    await deleteProduct(parsed.data.id);
    return successResponse(undefined, 'Product deleted');
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to delete product', 400);
  }
};
