import {NextRequest, NextResponse} from 'next/server'
import {addToCart, removeCartItem, updateCartQuantity} from '@/lib/actions/cart'
import {getSession} from '@/lib/server-actions'
import {readCart, readCartCount} from '@/lib/services/cart'

// Compatibility HTTP boundary; all mutations share the authenticated domain actions.
export const GET = async (request: NextRequest) => {
  const session = await getSession()
  if (!session) return NextResponse.json({success: false, message: 'Unauthorized'}, {status: 401})
  if (request.nextUrl.searchParams.get('summary') === 'count') {
    return NextResponse.json({success: true, data: {count: await readCartCount(session.user.id)}})
  }
  return NextResponse.json({success: true, data: await readCart(session.user.id)})
}

export const POST = async (request: NextRequest) => {
  const {variantId, quantity = 1} = await request.json()
  const result = await addToCart(variantId, quantity)
  return NextResponse.json(result, {status: result.success ? 200 : 400})
}

export const PUT = async (request: NextRequest) => {
  const {cartItemId, quantity} = await request.json()
  const result = await updateCartQuantity(cartItemId, quantity)
  return NextResponse.json(result, {status: result.success ? 200 : 400})
}

export const DELETE = async (request: NextRequest) => {
  const result = await removeCartItem(request.nextUrl.searchParams.get('id') ?? '')
  return NextResponse.json(result, {status: result.success ? 200 : 400})
}
