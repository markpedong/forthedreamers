import {NextRequest, NextResponse} from 'next/server'
import {z} from 'zod'
import {getSession} from '@/lib/services/auth'
import {setWishlist, wishlistIds, wishlistItems} from '@/lib/services/wishlist'

const idSchema = z.string().min(1).max(100)

export const GET = async (request: NextRequest) => {
  const session = await getSession()
  if (!session) return NextResponse.json({success: false, message: 'Unauthorized'}, {status: 401})
  if (request.nextUrl.searchParams.get('ids') === 'true') {
    return NextResponse.json({success: true, data: {ids: await wishlistIds(session.user.id)}})
  }
  const page = z.coerce.number().int().min(1).safeParse(request.nextUrl.searchParams.get('page') ?? 1)
  const limit = z.coerce.number().int().min(1).max(100).safeParse(request.nextUrl.searchParams.get('limit') ?? 20)
  if (!page.success || !limit.success) return NextResponse.json({success: false, message: 'Invalid pagination'}, {status: 400})
  return NextResponse.json({success: true, data: await wishlistItems(session.user.id, page.data, limit.data)})
}

const change = async (request: NextRequest, wanted: boolean) => {
  const session = await getSession()
  if (!session) return NextResponse.json({success: false, message: 'Please sign in to save products'}, {status: 401})
  const rawId = wanted ? (await request.json().catch(() => null))?.productId : request.nextUrl.searchParams.get('productId')
  const parsed = idSchema.safeParse(rawId)
  if (!parsed.success) return NextResponse.json({success: false, message: 'Invalid product'}, {status: 400})
  try {
    const data = await setWishlist(session.user.id, parsed.data, wanted)
    return NextResponse.json({success: true, message: wanted ? 'Added to wishlist' : 'Removed from wishlist', data})
  } catch (error) {
    return NextResponse.json({success: false, message: error instanceof Error ? error.message : 'Unable to update wishlist'}, {status: 400})
  }
}

export const POST = (request: NextRequest) => change(request, true)
export const DELETE = (request: NextRequest) => change(request, false)
