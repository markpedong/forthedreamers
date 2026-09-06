import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server-actions';
import { readCart } from '@/lib/services/cart';
import { addToCart, updateCartQuantity, removeCartItem } from '@/lib/actions/cart';
// Compatibility HTTP boundary; all mutations share the authenticated domain actions.
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ success: true, data: await readCart(session.user.id) });
}
export async function POST(req: NextRequest) {
  const { variantId, quantity = 1 } = await req.json();
  const result = await addToCart(variantId, quantity);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
export async function PUT(req: NextRequest) {
  const { cartItemId, quantity } = await req.json();
  const result = await updateCartQuantity(cartItemId, quantity);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
export async function DELETE(req: NextRequest) {
  const result = await removeCartItem(req.nextUrl.searchParams.get('id') ?? '');
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
