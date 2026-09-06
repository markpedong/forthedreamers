import 'server-only';
import prisma from '@/lib/prisma';
import { cached } from '@/lib/cache';
import { cacheKeys } from '@/lib/cache-keys';
import { Prisma } from '@/generated/prisma';
export const cardSelect = {
  id: true, name: true, images: true, basePrice: true, slug: true,
  variants: { select: { price: true }, orderBy: { createdAt: 'asc' }, take: 1 },
} satisfies Prisma.ProductSelect;
export const homeProducts = () => cached('catalog', cacheKeys.home, 60, () => prisma.product.findMany({
  where: { status: 'ACTIVE' }, select: cardSelect, orderBy: [{ createdAt: 'desc' }, { id: 'asc' }], take: 24,
}));
export const publicCategories = () => cached('catalog', cacheKeys.categories, 3600, () => prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }));
// Stock is present for the variant picker; keep the display TTL to 30 seconds.
export const productBySlug = (slug: string) => cached('catalog', cacheKeys.product(slug), 30, () => prisma.product.findFirst({
  where: { slug, status: 'ACTIVE' },
  select: {
    id: true, name: true, slug: true, brand: true, basePrice: true, description: true, images: true, tags: true,
    rating: true, reviewCount: true, sold: true, stock: true, status: true, sellerId: true, categoryId: true,
    createdAt: true, updatedAt: true,
    category: { select: { id: true, name: true } },
    seller: { select: { id: true, userId: true, storeName: true, rating: true, reviewCount: true, totalSales: true, description: true, contact: true, address: true, logo: true, banner: true } },
    variants: { select: { id: true, name: true, stock: true, price: true, discountedPrice: true, coupon: true, image: true, attributes: true } },
    specs: { select: { id: true, label: true, value: true } },
  },
}));
