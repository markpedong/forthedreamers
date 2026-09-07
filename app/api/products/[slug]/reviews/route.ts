import {invalidateCatalog} from '@/lib/cache'
import prisma from '@/lib/prisma'
import {getSession} from '@/lib/server-actions'
import {errorResponse, successResponse} from '@/lib/server-helper'
import {revalidatePath} from 'next/cache'
import {NextRequest} from 'next/server'
import {z} from 'zod'

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
    const page = z.coerce
      .number()
      .int()
      .min(1)
      .max(10000)
      .parse(searchParams.get('page') ?? 1)
    const limit = z.coerce
      .number()
      .int()
      .min(1)
      .max(20)
      .parse(searchParams.get('limit') ?? 6)
    const requestedRating = Number(searchParams.get('rating')) || 0
    const rating = Number.isInteger(requestedRating) && requestedRating >= 1 && requestedRating <= 5 ? requestedRating : undefined
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
        orderBy: [{[sortBy]: order}, {id: 'asc'}],
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
    const review = await prisma.$transaction(
      async tx => {
        const product = await tx.product.findFirst({where: {slug, status: 'ACTIVE'}, select: {id: true}})
        if (!product) throw new Error('Product not found')

        const purchased = await tx.orderItem.findFirst({
          where: {
            variant: {productId: product.id},
            order: {
              userId: session.user.id,
              status: {in: [...paidStatuses]},
              OR: [{orderGroupId: null}, {orderGroup: {paymentStatus: 'PAID'}}]
            },
            ...(validated.variantId ? {variantId: validated.variantId} : {})
          },
          select: {id: true}
        })
        if (!purchased) throw new Error('A paid purchase is required to review this product')

        const existingReview = await tx.review.findFirst({where: {productId: product.id, userId: session.user.id}, select: {id: true}})
        if (existingReview) throw new Error('You have already reviewed this product')

        const review = await tx.review.create({
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

        const aggregate = await tx.review.aggregate({
          where: {productId: product.id, isPublished: true},
          _avg: {rating: true},
          _count: {_all: true}
        })
        await tx.product.update({
          where: {id: product.id},
          data: {rating: aggregate._avg.rating ?? 0, reviewCount: aggregate._count._all}
        })
        return review
      },
      {isolationLevel: 'Serializable'}
    )
    await invalidateCatalog()
    revalidatePath('/products/[slug]', 'page')
    revalidatePath('/')

    return successResponse({...review, createdAt: review.createdAt.toISOString()}, 'Review submitted successfully', 201)
  } catch (error) {
    if (error instanceof z.ZodError) return errorResponse('Invalid input data')
    if (
      error instanceof Error &&
      ['Product not found', 'A paid purchase is required to review this product', 'You have already reviewed this product'].includes(
        error.message
      )
    )
      return errorResponse(error.message)
    return errorResponse('Unable to submit review')
  }
}
