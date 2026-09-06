import { NextRequest, NextResponse } from 'next/server';
import { setProductStatus } from '@/lib/actions/admin-catalog';
export async function PATCH(req: NextRequest) {
  const { id, active } = await req.json();
  const result = await setProductStatus(id, active);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
