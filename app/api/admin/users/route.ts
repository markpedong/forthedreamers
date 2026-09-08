import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { USER_ROLE } from '@/generated/prisma';
import { getSession } from '@/lib/services/auth';
import { deleteUser, setUserBanned } from '@/lib/services/admin-users';

const schema = z.object({ userId: z.string().uuid(), banned: z.boolean() });
const authorize = async () => (await getSession())?.user.role === USER_ROLE.ADMIN;

export const PATCH = async (request: NextRequest) => {
  if (!(await authorize())) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ success: false, message: 'Invalid user update' }, { status: 400 });
  await setUserBanned(parsed.data.userId, parsed.data.banned);
  return NextResponse.json({ success: true });
};

export const DELETE = async (request: NextRequest) => {
  if (!(await authorize())) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  const parsed = z.string().uuid().safeParse(request.nextUrl.searchParams.get('id'));
  if (!parsed.success) return NextResponse.json({ success: false, message: 'Invalid user' }, { status: 400 });
  await deleteUser(parsed.data);
  return NextResponse.json({ success: true });
};
