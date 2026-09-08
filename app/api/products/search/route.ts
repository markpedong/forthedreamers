import { NextRequest } from 'next/server';
import { Prisma } from '@/generated/prisma';
import { successResponse, errorResponse, getPaginatedData } from '@/lib/server-helper';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const searchSchema = z.object({
  q: z.string().trim().max(200).default(''),
  category: z.string().max(100).default(''),
  brand: z.string().max(100).default(''),
  minPrice: z.coerce.number().finite().nonnegative().optional(),
  maxPrice: z.coerce.number().finite().nonnegative().optional(),
  minRating: z.coerce.number().finite().min(0).max(5).default(0),
  maxRating: z.coerce.number().finite().min(0).max(5).default(5),
  inStock: z.enum(['0', '1']).optional(),
  sortBy: z.enum(['name', 'price', 'basePrice', 'rating', 'sold', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(request: NextRequest) {
  const parsed = searchSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return errorResponse('Invalid search filters', 400);

  try {
    const { q, category, brand, minPrice, maxPrice, minRating, maxRating, inStock, page, limit, order } = parsed.data;
    if (minPrice != null && maxPrice != null && minPrice > maxPrice)
      return errorResponse('Minimum price cannot exceed maximum price', 400);
    if (minRating > maxRating) return errorResponse('Minimum rating cannot exceed maximum rating', 400);

    const price = { ...(minPrice != null && { gte: minPrice }), ...(maxPrice != null && { lte: maxPrice }) };
    const constraints: Prisma.ProductWhereInput[] = [];
    if (q) {
      constraints.push({
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      });
    }
    if (minPrice != null || maxPrice != null) {
      constraints.push({ OR: [{ basePrice: price }, { basePrice: null, variants: { some: { price } } }] });
    }
    if (inStock === '1') {
      constraints.push({ OR: [{ stock: { gt: 0 } }, { variants: { some: { stock: { gt: 0 } } } }] });
    } else if (inStock === '0') {
      constraints.push({
        AND: [{ OR: [{ stock: { lte: 0 } }, { stock: null }] }, { variants: { none: { stock: { gt: 0 } } } }],
      });
    }

    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
      ...(category
        ? { category: { OR: [{ id: category }, { name: { equals: category, mode: 'insensitive' } }] } }
        : {}),
      ...(brand ? { brand: { equals: brand, mode: 'insensitive' } } : {}),
      rating: { gte: minRating, lte: maxRating },
      ...(constraints.length && { AND: constraints }),
    };
    const sortBy = parsed.data.sortBy === 'price' ? 'basePrice' : parsed.data.sortBy;
    const result = await getPaginatedData({
      model: 'product',
      where: { ...where, page, pageSize: limit },
      orderBy: [{ [sortBy]: order }, { id: 'asc' }],
      include: {
        category: { select: { id: true, name: true } },
        seller: { select: { storeName: true } },
        variants: {
          select: { id: true, name: true, price: true, discountedPrice: true, stock: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
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

    return successResponse({
      products: result.data,
      total: result.total,
      page: result.page,
      limit: result.pageSize,
      categories,
      brands: brands.flatMap(item => (item.brand ? [item.brand] : [])),
    });
  } catch (error) {
    console.error('Search API error:', error);
    return errorResponse('Unable to search products', 500);
  }
}
