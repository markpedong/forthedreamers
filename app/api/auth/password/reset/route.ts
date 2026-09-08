import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resetPassword } from '@/lib/services/auth';

const schema = z.object({ token: z.string().trim().min(1), password: z.string().min(8).max(128) });

export const PUT = async (request: NextRequest) => {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ success: false, message: 'Invalid password reset request' }, { status: 400 });
  try {
    await resetPassword(parsed.data.token, parsed.data.password);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unable to reset password' },
      { status: 400 }
    );
  }
};
