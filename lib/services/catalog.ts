import { Prisma } from '@/generated/prisma';
import { cached } from '@/lib/cache';
import { cacheKeys } from '@/lib/cache-keys';
import prisma from '@/lib/prisma';
import 'server-only';
import { z } from 'zod';

export const cardSelect = {
  id: true,
  name: true,
  images: true,
  basePrice: true,
  slug: true,
  rating: true,
  reviewCount: true,
  variants: { select: { price: true }, orderBy: { createdAt: 'asc' }, take: 1 },
} satisfies Prisma.ProductSelect;

export const homeProducts = () =>
  cached('catalog', cacheKeys.home, 300, () =>
    prisma.product.findMany({
      where: { status: 'ACTIVE' },
      select: cardSelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      take: 4,
    })
  );

export const productSlugs = () =>
  cached('catalog', cacheKeys.productSlugs, 300, () =>
    prisma.product.findMany({
      where: { status: 'ACTIVE' },
      select: { slug: true },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      take: 24,
    })
  );

export const publicCategories = () =>
  cached('catalog', cacheKeys.categories, 3600, () =>
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: { select: { products: { where: { status: 'ACTIVE' } } } },
      },
      orderBy: { name: 'asc' },
    })
  );

export const apiProductBySlug = (slug: string) =>
  prisma.product.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      brand: true,
      basePrice: true,
      description: true,
      images: true,
      tags: true,
      stock: true,
      rating: true,
      reviewCount: true,
      createdAt: true,
      category: { select: { id: true, name: true } },
      seller: { select: { storeName: true } },
      variants: { select: { id: true, name: true, price: true, discountedPrice: true, stock: true } },
      specs: { select: { label: true, value: true } },
    },
  });

// Stock and public review data are intentionally short-lived. Purchase actions re-check stock and price in the database.
export const productBySlug = (slug: string) =>
  cached('catalog', `${cacheKeys.product(slug)}:detail-v2`, 60, async () => {
    const product = await prisma.product.findFirst({
      where: { slug, status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
        brand: true,
        basePrice: true,
        description: true,
        images: true,
        tags: true,
        stock: true,
        category: { select: { id: true, name: true } },
        seller: {
          select: {
            id: true,
            storeName: true,
            description: true,
            logo: true,
            createdAt: true,
            rating: true,
            reviewCount: true,
          },
        },
        specs: { select: { id: true, label: true, value: true }, orderBy: { createdAt: 'asc' } },
        variants: {
          select: {
            id: true,
            name: true,
            stock: true,
            price: true,
            discountedPrice: true,
            coupon: true,
            attributes: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!product) return null;

    const reviewWhere = { productId: product.id, isPublished: true };
    const paidStatuses = ['PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED'] as const;

    // sellerProductCount is independent — include in the parallel batch
    const [reviewAggregate, reviewGroups, reviews, soldAggregate, relatedProducts, sellerProducts, sellerProductCount] =
      await Promise.all([
        prisma.review.aggregate({ where: reviewWhere, _avg: { rating: true }, _count: { _all: true } }),
        prisma.review.groupBy({ by: ['rating'], where: reviewWhere, _count: { _all: true } }),
        prisma.review.findMany({
          where: reviewWhere,
          select: {
            id: true,
            rating: true,
            title: true,
            comment: true,
            createdAt: true,
            user: { select: { name: true, image: true } },
            variant: { select: { name: true } },
          },
          orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
          take: 6,
        }),
        prisma.orderItem.aggregate({
          where: {
            variant: { productId: product.id },
            order: {
              status: { in: [...paidStatuses] },
              OR: [{ orderGroupId: null }, { orderGroup: { paymentStatus: 'PAID' } }],
            },
          },
          _sum: { quantity: true },
        }),
        prisma.product.findMany({
          where: { status: 'ACTIVE', categoryId: product.category.id, id: { not: product.id } },
          select: cardSelect,
          orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }],
          take: 8,
        }),
        prisma.product.findMany({
          where: { status: 'ACTIVE', sellerId: product.seller.id, id: { not: product.id } },
          select: cardSelect,
          orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
          take: 4,
        }),
        prisma.product.count({ where: { sellerId: product.seller.id, status: 'ACTIVE' } }),
      ]);

    const distribution = Object.fromEntries([1, 2, 3, 4, 5].map(rating => [rating, 0])) as Record<number, number>;
    for (const group of reviewGroups) distribution[group.rating] = group._count._all;

    return {
      ...product,
      variants: product.variants.map(variant => ({
        ...variant,
        attributes: z.record(z.string(), z.string()).catch({}).parse(variant.attributes),
      })),
      reviews: reviews.map(review => ({
        ...review,
        createdAt: review.createdAt.toISOString(),
      })),
      reviewSummary: {
        average: reviewAggregate._avg.rating ?? 0,
        count: reviewAggregate._count._all,
        distribution,
      },
      soldCount: soldAggregate._sum.quantity ?? 0,
      sellerProductCount,
      relatedProducts,
      sellerProducts,
    };
  });
