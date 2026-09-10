import 'server-only';
import prisma from '@/lib/prisma';
import { invalidateCatalog } from '@/lib/cache';
import { ENABLED_PAYMENT_METHOD } from '@/constants/payment';
import { getCourier, type CourierCode } from '@/constants/shipping';

type CheckoutInput = {
  addressId: string;
  cartItemIds: string[];
  paymentMethod: string;
  shipments: Array<{ sellerId: string; courierCode: CourierCode }>;
};

export const checkout = async (userId: string, input: CheckoutInput) => {
  if (input.paymentMethod !== ENABLED_PAYMENT_METHOD) throw new Error('Payment method is not available');

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
        if (item.variant.stock < item.quantity) throw new Error('Insufficient stock');
      }

      const cents = (price: number) => Math.round(price * 100);
      const amount = (item: (typeof items)[number]) =>
        cents(item.variant.discountedPrice ?? item.variant.price) * item.quantity;

      const sellers = [...new Set(items.map(item => item.variant.product.sellerId))];
      const sellerSet = new Set(sellers);
      const submittedShipments = new Map<string, CourierCode>();
      for (const shipment of input.shipments) {
        if (submittedShipments.has(shipment.sellerId)) throw new Error('Duplicate seller shipping selection');
        if (!sellerSet.has(shipment.sellerId)) throw new Error('Shipping selection does not match the cart');
        submittedShipments.set(shipment.sellerId, shipment.courierCode);
      }
      if (submittedShipments.size !== sellers.length) throw new Error('Select shipping for every shop');

      const sellerRecords = await tx.seller.findMany({
        where: { id: { in: sellers } },
        select: {
          id: true,
          storeName: true,
          shippingMethods: { where: { isActive: true }, select: { id: true, code: true } },
        },
      });
      if (sellerRecords.length !== sellers.length) throw new Error('A shop in your cart is no longer available');

      const shippingBySeller = new Map<string, { methodId: string; fee: number }>();
      for (const seller of sellerRecords) {
        const availableMethods = seller.shippingMethods.filter(method => getCourier(method.code));
        if (availableMethods.length === 0)
          throw new Error(`${seller.storeName} has no available shipping method`);

        const selectedCode = submittedShipments.get(seller.id);
        const courier = selectedCode ? getCourier(selectedCode) : undefined;
        const method = availableMethods.find(candidate => candidate.code === selectedCode);
        if (!courier || !method) throw new Error(`Selected courier is not available for ${seller.storeName}`);
        shippingBySeller.set(seller.id, { methodId: method.id, fee: cents(courier.fee) });
      }

      const totalShipping = [...shippingBySeller.values()].reduce((sum, shipment) => sum + shipment.fee, 0);
      const totalAmount = (items.reduce((sum, item) => sum + amount(item), 0) + totalShipping) / 100;

      if (!Number.isFinite(totalAmount) || totalAmount <= 0) throw new Error('Invalid total');

      for (const item of items) {
        const updated = await tx.variant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count !== 1) throw new Error('Insufficient stock');
      }

      const group = await tx.orderGroup.create({
        data: {
          userId,
          totalAmount,
          paymentMethod: ENABLED_PAYMENT_METHOD,
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
        const shipping = shippingBySeller.get(sellerId);
        if (!shipping) throw new Error('Select shipping for every shop');
        await tx.order.create({
          data: {
            userId,
            sellerId,
            orderGroupId: group.id,
            total: (sellerItems.reduce((sum, item) => sum + amount(item), 0) + shipping.fee) / 100,
            shippingFee: shipping.fee / 100,
            shippingMethodId: shipping.methodId,
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
    { isolationLevel: 'Serializable', timeout: 15_000 }
  );
  await invalidateCatalog();
  return { orderGroupId: checkoutState.id };
};
