import { NextRequest } from 'next/server';
import { sellerSignup, sellerSignupSchema } from '@/lib/services/seller';
import { errorResponse, successResponse } from '@/lib/server-helper';

export const POST = async (request: NextRequest) => {
  const parsed = sellerSignupSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return errorResponse('Check your signup details', 400);
  try {
    const data = await sellerSignup(parsed.data);
    return successResponse(
      data,
      data.hasSession
        ? 'Seller account created'
        : 'Seller account created. Check your email to verify your account.'
    );
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to sign up', 400);
  }
};
