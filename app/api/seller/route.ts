import { NextRequest, NextResponse } from 'next/server';
import { sellerSignup, sellerSignupSchema } from '@/lib/services/seller';

export const POST = async (request: NextRequest) => {
  const parsed = sellerSignupSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ success: false, message: 'Check your signup details' }, { status: 400 });
  try {
    const data = await sellerSignup(parsed.data);
    return NextResponse.json({
      success: true,
      message: data.hasSession
        ? 'Seller account created'
        : 'Seller account created. Check your email to verify your account.',
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unable to sign up' },
      { status: 400 }
    );
  }
};
