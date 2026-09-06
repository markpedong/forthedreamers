import { NextRequest, NextResponse } from 'next/server';
import { finishSellerSignup } from '@/lib/actions/seller';
export async function POST(req: NextRequest) {
  const result = await finishSellerSignup((await req.json()).storeName);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
