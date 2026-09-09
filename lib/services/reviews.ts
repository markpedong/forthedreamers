import 'server-only';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { invalidateCatalog } from '@/lib/cache';
import { revalidatePath } from 'next/cache';
import { formatDate } from '@/lib/utils';

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(100).optional(),
  comment: z.string().trim().max(1000).optional(),
  variantId: z.string().min(1).optional(),
});

type ReviewInput = z.infer<typeof reviewSchema>;
type ReviewQuery = {
  page: number;
  limit: number;
  rating?: number;
  sortBy: 'rating' | 'createdAt';
  order: 'asc' | 'desc';
};
const paidStatuses = ['PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED'] as const;

export const listReviews = async (slug: string, { page, limit, rating, sortBy, order }: ReviewQuery) => {
  const product = await prisma.product.findFirst({ where: { slug, status: 'ACTIVE' }, select: { id: true } });
  if (!product) throw new Error('Product not found');
  const where = { productId: product.id, isPublished: true, ...(rating ? { rating } : {}) };
  const [reviews, aggregate] = await Promise.all([
    prisma.review.findMany({
      where,
      select: {
        id: true,
        rating: true,
        title: true,
        comment: true,
        createdAt: true,
        user: { select: { name: true, image: true } },
        variant: { select: { name: true } },
      },
      orderBy: [{ [sortBy]: order }, { id: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.review.aggregate({
      where,
      _avg: { rating: true },
      _count: { _all: true },
    }),
  ]);
  return {
    reviews: reviews.map(review => ({ ...review, createdAt: formatDate(review.createdAt) })),
    total: aggregate._count._all,
    page,
    limit,
    averageRating: aggregate._avg.rating ?? 0,
    reviewCount: aggregate._count._all,
  };
};

export const createReview = async (userId: string, slug: string, validated: ReviewInput) => {
  const review = await prisma.$transaction(
    async tx => {
      const product = await tx.product.findFirst({ where: { slug, status: 'ACTIVE' }, select: { id: true } });
      if (!product) throw new Error('Product not found');
      const purchased = await tx.orderItem.findFirst({
        where: {
          variant: { productId: product.id },
          order: {
            userId,
            status: { in: [...paidStatuses] },
            OR: [{ orderGroupId: null }, { orderGroup: { paymentStatus: 'PAID' } }],
          },
          ...(validated.variantId ? { variantId: validated.variantId } : {}),
        },
        select: { id: true },
      });
      if (!purchased) throw new Error('A paid purchase is required to review this product');
      if (await tx.review.findFirst({ where: { productId: product.id, userId }, select: { id: true } })) {
        throw new Error('You have already reviewed this product');
      }
      const created = await tx.review.create({
        data: { productId: product.id, userId, ...validated },
        select: {
          id: true,
          rating: true,
          title: true,
          comment: true,
          createdAt: true,
          user: { select: { name: true, image: true } },
          variant: { select: { name: true } },
        },
      });
      const aggregate = await tx.review.aggregate({
        where: { productId: product.id, isPublished: true },
        _avg: { rating: true },
        _count: { _all: true },
      });
      await tx.product.update({
        where: { id: product.id },
        data: { rating: aggregate._avg.rating ?? 0, reviewCount: aggregate._count._all },
      });
      return created;
    },
    { isolationLevel: 'Serializable' }
  );
  await invalidateCatalog();
  revalidatePath('/products/[slug]', 'page');
  revalidatePath('/');
  return { ...review, createdAt: formatDate(review.createdAt) };
};
