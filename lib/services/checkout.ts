import 'server-only';
import prisma from '@/lib/prisma';
import { invalidateCatalog } from '@/lib/cache';

export const checkout = async (userId: string, shippingMethodId?: string) => {
  const checkoutState = await prisma.$transaction(
    async tx => {
      // Reading cart, price, visibility and inventory inside the same serializable transaction
      // prevents concurrent checkout from purchasing the same cart twice.
      const items = await tx.cartItem.findMany({
        where: { userId },
        select: {
          id: true,
          variantId: true,
          quantity: true,
          variant: {
            select: {
              price: true,
              discountedPrice: true,
              stock: true,
              productId: true,
              product: { select: { status: true, sellerId: true } },
            },
          },
        },
      });
      if (!items.length) {
        const pending = await tx.orderGroup.findFirst({
          where: { userId, paymentStatus: 'PENDING' },
          orderBy: { createdAt: 'desc' },
        });
        if (pending) return { group: pending, reused: true };
        throw new Error('Cart is empty');
      }
      if (items.length > 100) throw new Error('Too many cart items');
      for (const item of items) {
        if (!Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.variant.product.status !== 'ACTIVE')
          throw new Error('Invalid cart item');
        const updated = await tx.variant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count !== 1) throw new Error('Insufficient stock');
      }

      // Validate and resolve shipping method (server-side, not trusted from client)
      let shippingFee = 0;
      if (shippingMethodId) {
        const method = await tx.shippingMethod.findUnique({
          where: { id: shippingMethodId },
        });
        if (!method || !method.isActive) throw new Error('Invalid shipping method');
        shippingFee = method.price;
      }

      const cents = (price: number) => Math.round(price * 100);
      const amount = (item: (typeof items)[number]) =>
        cents(item.variant.discountedPrice ?? item.variant.price) * item.quantity;

      // Per-seller shipping: each seller's order gets the same shipping fee
      const sellers = [...new Set(items.map(item => item.variant.product.sellerId))];
      const totalShipping = shippingFee * sellers.length;
      const totalAmount = (items.reduce((sum, item) => sum + amount(item), 0) + totalShipping * 100) / 100;

      if (!Number.isFinite(totalAmount) || totalAmount <= 0) throw new Error('Invalid total');

      const group = await tx.orderGroup.create({ data: { userId, totalAmount, paymentStatus: 'PAID' } });

      for (const sellerId of sellers) {
        const sellerItems = items.filter(item => item.variant.product.sellerId === sellerId);
        await tx.order.create({
          data: {
            userId,
            sellerId,
            orderGroupId: group.id,
            total: (sellerItems.reduce((sum, item) => sum + amount(item), 0) / 100) + shippingFee,
            shippingFee,
            shippingMethodId: shippingMethodId || null,
            status: 'PAID',
            orderItems: {
              create: sellerItems.map(item => ({
                variantId: item.variantId,
                productId: item.variant.productId,
                quantity: item.quantity,
                priceAtPurchase: item.variant.price,
                discountedPriceAtPurchase: item.variant.discountedPrice,
                finalPriceAfterDiscount: amount(item) / 100,
              })),
            },
          },
        });
      }

      const quantitiesByProduct = new Map<string, number>();
      for (const item of items) {
        quantitiesByProduct.set(
          item.variant.productId,
          (quantitiesByProduct.get(item.variant.productId) ?? 0) + item.quantity
        );
      }
      for (const [productId, quantity] of quantitiesByProduct) {
        await tx.product.update({ where: { id: productId }, data: { sold: { increment: quantity } } });
      }
      await tx.cartItem.deleteMany({ where: { userId, id: { in: items.map(item => item.id) } } });
      return { group, reused: false };
    },
    { isolationLevel: 'Serializable' }
  );
  await invalidateCatalog();
  return { orderGroupId: checkoutState.group.id };
};
