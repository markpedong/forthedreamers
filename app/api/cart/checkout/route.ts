import { NextResponse } from 'next/server';
import { startCheckout } from '@/lib/actions/checkout';

const POST = async () => {
  const result = await startCheckout();

  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}

export default POST;