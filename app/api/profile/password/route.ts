import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { changePassword, getSession } from '@/lib/services/auth';

const schema = z.object({ password: z.string().min(8).max(128) });

export const PATCH = async (request: NextRequest) => {
  if (!(await getSession())) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 400 });
  try {
    await changePassword(parsed.data.password);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unable to change password' },
      { status: 400 }
    );
  }
};
