import { NextResponse } from 'next/server';
export async function POST() {
  return new NextResponse('Stripe payments are currently disabled', { status: 503 });
}
