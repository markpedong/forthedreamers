import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { USER_ROLE } from '@/generated/prisma';
import { getSession } from '@/lib/services/auth';
import { adminProducts, deleteProduct, productSchema, saveProduct } from '@/lib/services/admin-catalog';

const hasCatalogAccess = async () => {
  const session = await getSession();
  return session && (session.user.role === USER_ROLE.ADMIN || session.user.role === USER_ROLE.SELLER);
};

export const GET = async () => {
  if (!(await hasCatalogAccess())) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  return NextResponse.json({ success: true, data: await adminProducts() });
};

const save = async (request: NextRequest, editing: boolean) => {
  if (!(await hasCatalogAccess())) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  const parsed = productSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || (editing && !parsed.data.id))
    return NextResponse.json({ success: false, message: 'Invalid product' }, { status: 400 });
  try {
    return NextResponse.json({
      success: true,
      message: 'Saved successfully',
      data: await saveProduct(parsed.data, editing),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unable to save product' },
      { status: 400 }
    );
  }
};

export const POST = (request: NextRequest) => save(request, false);
export const PUT = (request: NextRequest) => save(request, true);

export const DELETE = async (request: NextRequest) => {
  if (!(await hasCatalogAccess())) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  const parsed = z.object({ id: z.string().min(1).max(100) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ success: false, message: 'Invalid product' }, { status: 400 });
  try {
    await deleteProduct(parsed.data.id);
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unable to delete product' },
      { status: 400 }
    );
  }
};
