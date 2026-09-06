import {NextRequest} from 'next/server'
import {z} from 'zod'
import {invalidateCatalog} from '@/lib/cache'
import {getSession} from '@/lib/server-actions'
import prisma from '@/lib/prisma'
import {errorResponse, successResponse} from '@/lib/server-helper'

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(100).optional(),
  comment: z.string().trim().max(1000).optional(),
  variantId: z.string().min(1).optional()
})

const paidStatuses = ['PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED'] as const

export const GET = async (request: NextRequest, {params}: {params: Promise<{slug: string}>}) => {
  try {
    const {slug} = await params
    const {searchParams} = new URL(request.url)
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.min(20, Math.max(1, Number(searchParams.get('limit')) || 6))
    const requestedRating = Number(searchParams.get('rating')) || 0
    const rating = requestedRating >= 1 && requestedRating <= 5 ? requestedRating : undefined
    const sortBy = searchParams.get('sortBy') === 'rating' ? 'rating' : 'createdAt'
    const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc'
    const product = await prisma.product.findFirst({where: {slug, status: 'ACTIVE'}, select: {id: true}})

    if (!product) return errorResponse('Product not found')

    const where = {productId: product.id, isPublished: true, ...(rating ? {rating} : {})}
    const [reviews, total, aggregate] = await Promise.all([
      prisma.review.findMany({
        where,
        select: {
          id: true,
          rating: true,
          title: true,
          comment: true,
          createdAt: true,
          user: {select: {name: true, image: true}},
          variant: {select: {name: true}}
        },
        orderBy: {[sortBy]: order},
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.review.count({where}),
      prisma.review.aggregate({where: {productId: product.id, isPublished: true}, _avg: {rating: true}, _count: {_all: true}})
    ])

    return successResponse({
      reviews: reviews.map(review => ({...review, createdAt: review.createdAt.toISOString()})),
      total,
      page,
      limit,
      averageRating: aggregate._avg.rating ?? 0,
      reviewCount: aggregate._count._all
    })
  } catch {
    return errorResponse('Unable to load reviews')
  }
}

export const POST = async (request: NextRequest, {params}: {params: Promise<{slug: string}>}) => {
  try {
    const session = await getSession()
    if (!session?.user) return errorResponse('Unauthorized')

    const {slug} = await params
    const validated = reviewSchema.parse(await request.json())
    const product = await prisma.product.findFirst({where: {slug, status: 'ACTIVE'}, select: {id: true}})
    if (!product) return errorResponse('Product not found')

    const purchased = await prisma.orderItem.findFirst({
      where: {
        productId: product.id,
        order: {userId: session.user.id, status: {in: [...paidStatuses]}},
        ...(validated.variantId ? {variantId: validated.variantId} : {})
      },
      select: {id: true}
    })
    if (!purchased) return errorResponse('A completed purchase is required to review this product')

    const existingReview = await prisma.review.findFirst({where: {productId: product.id, userId: session.user.id}, select: {id: true}})
    if (existingReview) return errorResponse('You have already reviewed this product')

    const review = await prisma.review.create({
      data: {
        productId: product.id,
        userId: session.user.id,
        rating: validated.rating,
        title: validated.title,
        comment: validated.comment,
        variantId: validated.variantId
      },
      select: {
        id: true,
        rating: true,
        title: true,
        comment: true,
        createdAt: true,
        user: {select: {name: true, image: true}},
        variant: {select: {name: true}}
      }
    })

    const aggregate = await prisma.review.aggregate({where: {productId: product.id, isPublished: true}, _avg: {rating: true}, _count: {_all: true}})
    await prisma.product.update({
      where: {id: product.id},
      data: {rating: aggregate._avg.rating ?? 0, reviewCount: aggregate._count._all}
    })
    await invalidateCatalog()

    return successResponse({...review, createdAt: review.createdAt.toISOString()}, 'Review submitted successfully', 201)
  } catch (error) {
    if (error instanceof z.ZodError) return errorResponse('Invalid input data')
    return errorResponse('Unable to submit review')
  }
}
