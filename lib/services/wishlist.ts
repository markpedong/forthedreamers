import { Prisma } from '@/generated/prisma';
import prisma from '@/lib/prisma';
import 'server-only';

const wishlistCardSelect = {
  id: true,
  addedAt: true,
  product: {
    select: {
      id: true,
      name: true,
      slug: true,
      images: true,
      basePrice: true,
      rating: true,
      reviewCount: true,
      category: { select: { id: true, name: true } },
      seller: { select: { storeName: true } },
      variants: { select: { price: true }, orderBy: { createdAt: 'asc' as const }, take: 1 },
    },
  },
} satisfies Prisma.WishlistSelect;

export const wishlistIds = async (userId: string) =>
  (await prisma.wishlist.findMany({ where: { userId }, select: { productId: true } })).map(item => item.productId);

export const wishlistItems = async (userId: string, page: number, limit: number) => {
  const where = { userId };
  // No total count — UI only shows paginated pages; exact count is expensive on large datasets
  const wishlist = await prisma.wishlist.findMany({
    where,
    select: wishlistCardSelect,
    orderBy: { addedAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });
  return { wishlist, total: undefined, page, limit };
};

export const setWishlist = async (userId: string, productId: string, wanted: boolean) => {
  if (wanted) {
    const product = await prisma.product.findFirst({
      where: { id: productId, status: 'ACTIVE' },
      select: { id: true },
    });
    if (!product) throw new Error('Product unavailable');
    await prisma.wishlist.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId },
      update: {},
    });
    return { productId, wanted: true };
  }
  await prisma.wishlist.deleteMany({ where: { userId, productId } });
  return { productId, wanted: false };
};
