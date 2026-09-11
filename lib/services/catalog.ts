import { Prisma } from '@/generated/prisma';
import { cached } from '@/lib/cache';
import { cacheKeys } from '@/lib/cache-keys';
import prisma from '@/lib/prisma';
import 'server-only';
import { formatDate } from '@/lib/utils';

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

export const productSearchFacets = () =>
  cached('catalog', cacheKeys.productFacets, 3600, async () => {
    const [categories, brands] = await Promise.all([
      prisma.category.findMany({
        where: { products: { some: { status: 'ACTIVE' } } },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),
      prisma.product.findMany({
        where: { status: 'ACTIVE', brand: { not: null } },
        select: { brand: true },
        distinct: ['brand'],
        orderBy: { brand: 'asc' },
      }),
    ]);

    return {
      categories,
      brands: brands.flatMap(item => (item.brand ? [item.brand] : [])),
    };
  });

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
  cached('catalog', `${cacheKeys.product(slug)}:detail-v3`, 60, async () => {
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
        rating: true,
        reviewCount: true,
        sold: true,
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
            _count: { select: { products: { where: { status: 'ACTIVE' } } } },
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
            image: true,
            attributes: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!product) return null;

    const { _count, ...seller } = product.seller;

    return {
      ...product,
      seller,
      variants: product.variants.map(variant => ({
        ...variant,
        attributes: variant.attributes as Record<string, string>,
      })),
      sellerProductCount: _count.products,
    };
  });

export const productSupplemental = (productId: string, categoryId: string, sellerId: string) =>
  cached('catalog', cacheKeys.productSupplemental(productId), 60, async () => {
    const reviewWhere = { productId, isPublished: true };
    const [reviewGroups, reviews, relatedProducts, sellerProducts] = await Promise.all([
      prisma.review.groupBy({ by: ['rating'], where: reviewWhere, _count: { _all: true } }),
      prisma.review.findMany({
        where: reviewWhere,
        select: {
          id: true,
          rating: true,
          title: true,
          comment: true,
          createdAt: true,
          user: { select: { displayName: true, username: true, image: true } },
          variant: { select: { name: true } },
        },
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
        take: 6,
      }),
      prisma.product.findMany({
        where: { status: 'ACTIVE', categoryId, id: { not: productId } },
        select: cardSelect,
        orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }],
        take: 8,
      }),
      prisma.product.findMany({
        where: { status: 'ACTIVE', sellerId, id: { not: productId } },
        select: cardSelect,
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
        take: 4,
      }),
    ]);

    const distribution = Object.fromEntries([1, 2, 3, 4, 5].map(rating => [rating, 0])) as Record<number, number>;
    for (const group of reviewGroups) distribution[group.rating] = group._count._all;

    return {
      distribution,
      reviews: reviews.map(review => ({ ...review, createdAt: formatDate(review.createdAt) })),
      relatedProducts,
      sellerProducts,
    };
  });
