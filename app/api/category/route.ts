import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { USER_ROLE } from '@/generated/prisma';
import { getSession } from '@/lib/services/auth';
import { publicCategories } from '@/lib/services/catalog';
import { saveCategory } from '@/lib/services/admin-catalog';

const schema = z.object({ id: z.string().min(1).max(100).optional(), name: z.string().trim().min(1).max(100) });
const isAdmin = async () => (await getSession())?.user.role === USER_ROLE.ADMIN;

export const GET = async () => NextResponse.json({ success: true, data: await publicCategories() });

const save = async (request: NextRequest, editing: boolean) => {
  if (!(await isAdmin())) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || (editing && !parsed.data.id))
    return NextResponse.json({ success: false, message: 'Invalid category' }, { status: 400 });
  try {
    return NextResponse.json({
      success: true,
      message: 'Saved successfully',
      data: await saveCategory(parsed.data.name, parsed.data.id),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unable to save category' },
      { status: 400 }
    );
  }
};

export const POST = (request: NextRequest) => save(request, false);
export const PUT = (request: NextRequest) => save(request, true);
