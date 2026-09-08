import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { socialSignInUrl } from '@/lib/services/auth';

const schema = z.object({ provider: z.literal('google'), next: z.enum(['/profile', '/dashboard']) });

export const POST = async (request: NextRequest) => {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ success: false, message: 'Invalid social sign-in request' }, { status: 400 });
  try {
    return NextResponse.json({
      success: true,
      data: { url: await socialSignInUrl(parsed.data.provider, parsed.data.next) },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unable to start social sign in' },
      { status: 400 }
    );
  }
};
