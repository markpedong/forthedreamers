'use server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/server-actions';
export async function setWishlist(productId: string, wanted: boolean) {
  try {
    z.string().min(1).max(100).parse(productId); z.boolean().parse(wanted);
    const session = await getSession();
    if (!session) return { success: false as const, message: 'Please sign in to save products' };
    if (wanted) {
      if (!await prisma.product.findFirst({ where: { id: productId, status: 'ACTIVE' }, select: { id: true } })) return { success: false as const, message: 'Product unavailable' };
      await prisma.wishlist.upsert({ where: { userId_productId: { userId: session.user.id, productId } }, create: { userId: session.user.id, productId }, update: {} });
    } else await prisma.wishlist.deleteMany({ where: { userId: session.user.id, productId } });
    return { success: true as const, message: wanted ? 'Added to wishlist' : 'Removed from wishlist', data: { productId, wanted } };
  } catch { return { success: false as const, message: 'Unable to update wishlist' }; }
}
