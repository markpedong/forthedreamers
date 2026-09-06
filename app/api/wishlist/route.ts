import {NextRequest, NextResponse} from 'next/server'
import {setWishlist} from '@/lib/actions/wishlist'
import {getSession} from '@/lib/server-actions'
import prisma from '@/lib/prisma'
import {errorResponse, getPaginatedData, successResponse} from '@/lib/server-helper'

/**
 * GET /api/wishlist
 * Get user's wishlist with pagination.
 */
export const GET = async (request: NextRequest) => {
  try {
    const session = await getSession()
    if (!session?.user) {
      return errorResponse('Unauthorized')
    }

    const {searchParams} = new URL(request.url)
    if (searchParams.get('ids') === 'true') {
      const items = await prisma.wishlist.findMany({where: {userId: session.user.id}, select: {productId: true}})
      return NextResponse.json({success: true, data: {ids: items.map(item => item.productId)}})
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const result = await getPaginatedData({
      model: 'wishlist',
      where: {userId: session.user.id, page, pageSize: limit},
      orderBy: {addedAt: 'desc'},
      include: {
        product: {
          include: {
            category: true,
            seller: true,
            variants: true,
          },
        },
      },
    })

    return successResponse({
      wishlist: result.data,
      total: result.total,
      page: result.page,
      limit: result.pageSize,
    })
  } catch (error) {
    console.error('Get wishlist error:', error)
    return errorResponse('Internal server error')
  }
}

/**
 * POST /api/wishlist
 * Add a product to wishlist.
 */
export const POST = async (request: NextRequest) => {
  const result = await setWishlist((await request.json()).productId, true)
  return NextResponse.json(result, {status: result.success ? 200 : 400})
}
// Explicit productId query parameter; this route has no dynamic [id] segment.
export const DELETE = async (request: NextRequest) => {
  const result = await setWishlist(request.nextUrl.searchParams.get('productId') ?? '', false)
  return NextResponse.json(result, {status: result.success ? 200 : 400})
}
