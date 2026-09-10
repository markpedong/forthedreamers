import 'server-only';
import prisma from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';

export const cartSelect = {
  id: true,
  variantId: true,
  quantity: true,
  variant: {
    select: {
      id: true,
      name: true,
      price: true,
      discountedPrice: true,
      stock: true,
      image: true,
      product: { select: { id: true, name: true, slug: true, images: true, sellerId: true } },
    },
  },
} satisfies Prisma.CartItemSelect;
export type CartItem = Prisma.CartItemGetPayload<{ select: typeof cartSelect }>;
export const readCart = (userId: string) =>
  prisma.cartItem.findMany({ where: { userId }, select: cartSelect, orderBy: { createdAt: 'asc' } });
export const readCartCount = (userId: string) => prisma.cartItem.count({ where: { userId } });
export class CartError extends Error {}

export async function mutateCart(userId: string, operation: 'add' | 'update' | 'remove', id: string, quantity = 1) {
  if (
    typeof id !== 'string' ||
    !id ||
    id.length > 100 ||
    !Number.isSafeInteger(quantity) ||
    quantity < 1 ||
    quantity > 999
  )
    throw new CartError('Invalid cart input');
  // Serializable retries protect cumulative quantity checks against concurrent tabs.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await prisma.$transaction(
        async tx => {
          const existing =
            operation === 'add'
              ? await tx.cartItem.findUnique({ where: { userId_variantId: { userId, variantId: id } } })
              : await tx.cartItem.findFirst({ where: { id, userId } });
          if (operation !== 'add' && !existing) throw new CartError('Cart item not found');
          let item: CartItem | null = null;
          if (operation === 'remove') {
            await tx.cartItem.delete({ where: { id: existing!.id, userId } });
          } else {
            const variant = await tx.variant.findUnique({
              where: { id: operation === 'add' ? id : existing!.variantId },
              select: { id: true, productId: true, stock: true, product: { select: { status: true } } },
            });
            if (!variant || variant.product.status !== 'ACTIVE') throw new CartError('Product is unavailable');
            const nextQuantity = operation === 'add' ? (existing?.quantity ?? 0) + quantity : quantity;
            if (nextQuantity > 999 || nextQuantity > variant.stock) throw new CartError('Insufficient stock');
            item = existing
              ? await tx.cartItem.update({
                  where: { id: existing.id, userId },
                  data: { quantity: nextQuantity },
                  select: cartSelect,
                })
              : await tx.cartItem.create({
                  data: { userId, variantId: variant.id, productId: variant.productId, quantity: nextQuantity },
                  select: cartSelect,
                });
          }
          return {
            item,
            removedId: operation === 'remove' ? id : null,
            count: await tx.cartItem.count({ where: { userId } }),
          };
        },
        { isolationLevel: 'Serializable' }
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        ['P2034', 'P2002'].includes(error.code) &&
        attempt < 2
      )
        continue;
      throw error;
    }
  }
  throw new CartError('Please retry your cart change');
}
