import { NextResponse } from 'next/server';
import { getSession, sendVerificationEmail } from '@/lib/services/auth';

export const POST = async () => {
  const session = await getSession();
  if (!session?.user.email) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  try {
    await sendVerificationEmail(session.user.email);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unable to send verification email' },
      { status: 400 }
    );
  }
};
