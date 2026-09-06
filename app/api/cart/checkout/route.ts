import { NextResponse } from 'next/server';
import { startCheckout } from '@/lib/actions/checkout';
export async function POST() { const result = await startCheckout(); return NextResponse.json(result, { status: result.success ? 200 : 400 }); }
