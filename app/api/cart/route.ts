import {NextRequest, NextResponse} from 'next/server'
import {z} from 'zod'
import {getSession} from '@/lib/services/auth'
import {CartError, mutateCart, readCart, readCartCount} from '@/lib/services/cart'

const mutationSchema = z.object({id: z.string().min(1).max(100), quantity: z.number().int().min(1).max(999).optional()})
const message = (operation: 'add' | 'update' | 'remove') => operation === 'add' ? 'Added to cart' : operation === 'remove' ? 'Removed from cart' : 'Cart updated'

const change = async (userId: string, operation: 'add' | 'update' | 'remove', input: unknown) => {
  const parsed = mutationSchema.safeParse(input)
  if (!parsed.success || (operation !== 'remove' && parsed.data.quantity === undefined)) {
    return NextResponse.json({success: false, message: 'Invalid cart input'}, {status: 400})
  }
  try {
    const data = await mutateCart(userId, operation, parsed.data.id, parsed.data.quantity)
    return NextResponse.json({success: true, message: message(operation), data})
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof CartError ? error.message : 'Unable to update cart. Please try again.'
    }, {status: 400})
  }
}

export const GET = async (request: NextRequest) => {
  const session = await getSession()
  if (!session) return NextResponse.json({success: false, message: 'Unauthorized'}, {status: 401})
  const data = request.nextUrl.searchParams.get('summary') === 'count'
    ? {count: await readCartCount(session.user.id)}
    : await readCart(session.user.id)
  return NextResponse.json({success: true, data})
}

export const POST = async (request: NextRequest) => {
  const session = await getSession()
  if (!session) return NextResponse.json({success: false, message: 'Please sign in first'}, {status: 401})
  const body = await request.json().catch(() => null)
  return change(session.user.id, 'add', body && {id: body.variantId, quantity: body.quantity ?? 1})
}

export const PUT = async (request: NextRequest) => {
  const session = await getSession()
  if (!session) return NextResponse.json({success: false, message: 'Please sign in first'}, {status: 401})
  const body = await request.json().catch(() => null)
  return change(session.user.id, 'update', body && {id: body.cartItemId, quantity: body.quantity})
}

export const DELETE = async (request: NextRequest) => {
  const session = await getSession()
  if (!session) return NextResponse.json({success: false, message: 'Please sign in first'}, {status: 401})
  return change(session.user.id, 'remove', {id: request.nextUrl.searchParams.get('id')})
}
