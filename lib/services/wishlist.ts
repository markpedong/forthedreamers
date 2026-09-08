import 'server-only';

import prisma from '@/lib/prisma';

export const wishlistIds = async (userId: string) =>
  (await prisma.wishlist.findMany({ where: { userId }, select: { productId: true } })).map(item => item.productId);

export const wishlistItems = async (userId: string, page: number, limit: number) => {
  const where = { userId };
  const [wishlist, total] = await Promise.all([
    prisma.wishlist.findMany({
      where,
      include: { product: { include: { category: true, seller: true, variants: true } } },
      orderBy: { addedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.wishlist.count({ where }),
  ]);
  return { wishlist, total, page, limit };
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
  } else {
    await prisma.wishlist.deleteMany({ where: { userId, productId } });
  }
  return { productId, wanted };
};
