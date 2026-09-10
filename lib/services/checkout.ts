import 'server-only';
import prisma from '@/lib/prisma';
import { invalidateCatalog } from '@/lib/cache';

type CheckoutInput = {
  addressId: string;
  shippingMethodId: string;
  cartItemIds: string[];
};

export const checkout = async (userId: string, input: CheckoutInput) => {
  const cartItemIds = [...new Set(input.cartItemIds)];
  if (!cartItemIds.length || cartItemIds.length > 100) throw new Error('Invalid cart selection');

  const checkoutState = await prisma.$transaction(
    async tx => {
      const address = await tx.address.findFirst({
        where: { id: input.addressId, userId },
        select: {
          fullName: true,
          phoneNumber: true,
          region: true,
          city: true,
          postalCode: true,
          street: true,
        },
      });
      if (!address) throw new Error('Select a valid shipping address');

      const shippingMethod = await tx.shippingMethod.findFirst({
        where: { id: input.shippingMethodId, isActive: true },
        select: { id: true, price: true },
      });
      if (!shippingMethod) throw new Error('Select a valid shipping method');

      // Reading cart, price, visibility and inventory inside the same serializable transaction
      // prevents concurrent checkout from purchasing the same cart twice.
      const items = await tx.cartItem.findMany({
        where: { userId, id: { in: cartItemIds } },
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
      if (items.length !== cartItemIds.length) throw new Error('Some cart items are no longer available');

      for (const item of items) {
        if (!Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.variant.product.status !== 'ACTIVE')
          throw new Error('Invalid cart item');
        const updated = await tx.variant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count !== 1) throw new Error('Insufficient stock');
      }

      const cents = (price: number) => Math.round(price * 100);
      const amount = (item: (typeof items)[number]) =>
        cents(item.variant.discountedPrice ?? item.variant.price) * item.quantity;

      const sellers = [...new Set(items.map(item => item.variant.product.sellerId))];
      const shippingFee = cents(shippingMethod.price);
      const totalAmount = (items.reduce((sum, item) => sum + amount(item), 0) + shippingFee * sellers.length) / 100;

      if (!Number.isFinite(totalAmount) || totalAmount <= 0) throw new Error('Invalid total');

      const group = await tx.orderGroup.create({
        data: {
          userId,
          totalAmount,
          paymentMethod: 'CASH_ON_DELIVERY',
          paymentStatus: 'PENDING',
          shippingFullName: address.fullName,
          shippingPhoneNumber: address.phoneNumber,
          shippingRegion: address.region,
          shippingCity: address.city,
          shippingPostalCode: address.postalCode,
          shippingStreet: address.street,
        },
      });

      for (const sellerId of sellers) {
        const sellerItems = items.filter(item => item.variant.product.sellerId === sellerId);
        await tx.order.create({
          data: {
            userId,
            sellerId,
            orderGroupId: group.id,
            total: (sellerItems.reduce((sum, item) => sum + amount(item), 0) + shippingFee) / 100,
            shippingFee: shippingFee / 100,
            shippingMethodId: shippingMethod.id,
            status: 'PENDING',
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
      return group;
    },
    { isolationLevel: 'Serializable' }
  );
  await invalidateCatalog();
  return { orderGroupId: checkoutState.id };
};
