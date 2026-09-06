import 'server-only';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';
import { invalidateCatalog } from '@/lib/cache';
export const checkout = async (userId: string) => {
  const secret = process.env.STRIPE_SECRET_KEY;
  const origin = process.env.NEXT_PUBLIC_APP_URL;
  if (!secret || !origin) throw new Error('Checkout is not configured');
  const stripe = new Stripe(secret);
  const checkoutState = await prisma.$transaction(async tx => {
    // Reading cart, price, visibility and inventory inside the same serializable transaction
    // prevents concurrent checkout from purchasing the same cart twice.
    const items = await tx.cartItem.findMany({ where: { userId }, select: {
      id: true, variantId: true, quantity: true,
      variant: { select: { price: true, discountedPrice: true, stock: true, productId: true, product: { select: { status: true, sellerId: true } } } },
    } });
    if (!items.length) {
      const pending = await tx.orderGroup.findFirst({ where: { userId, paymentStatus: 'PENDING' }, orderBy: { createdAt: 'desc' } });
      if (pending) return {group: pending, reused: true}
      throw new Error('Cart is empty');
    }
    if (items.length > 100) throw new Error('Too many cart items');
    for (const item of items) {
      if (!Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.variant.product.status !== 'ACTIVE') throw new Error('Invalid cart item');
      const updated = await tx.variant.updateMany({ where: { id: item.variantId, stock: { gte: item.quantity } }, data: { stock: { decrement: item.quantity } } });
      if (updated.count !== 1) throw new Error('Insufficient stock');
    }
    const cents = (price: number) => Math.round(price * 100);
    const amount = (item: typeof items[number]) => cents(item.variant.discountedPrice ?? item.variant.price) * item.quantity;
    const totalAmount = items.reduce((sum, item) => sum + amount(item), 0) / 100;
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) throw new Error('Invalid total');
    const group = await tx.orderGroup.create({ data: { userId, totalAmount, paymentStatus: 'PENDING' } });
    const sellers = [...new Set(items.map(item => item.variant.product.sellerId))];
    for (const sellerId of sellers) {
      const sellerItems = items.filter(item => item.variant.product.sellerId === sellerId);
      await tx.order.create({ data: { userId, sellerId, orderGroupId: group.id, total: sellerItems.reduce((sum, item) => sum + amount(item), 0) / 100, status: 'PENDING',
        orderItems: { create: sellerItems.map(item => ({ variantId: item.variantId, productId: item.variant.productId, quantity: item.quantity,
          priceAtPurchase: item.variant.price, discountedPriceAtPurchase: item.variant.discountedPrice, finalPriceAfterDiscount: amount(item) / 100 })) },
      } });
    }
    await tx.cartItem.deleteMany({ where: { userId, id: { in: items.map(item => item.id) } } });
    return {group, reused: false}
  }, { isolationLevel: 'Serializable' });
  const group = checkoutState.group
  await invalidateCatalog();
  // A failed network request leaves a resumable pending order. Retrying uses the same
  // Stripe idempotency key, so it cannot create a second payment for the order.
  let session
  try {
    session = await stripe.checkout.sessions.create({
    mode: 'payment', payment_method_types: ['card'], client_reference_id: group.id,
    metadata: { orderGroupId: group.id }, payment_intent_data: { metadata: { orderGroupId: group.id } },
    line_items: [{ quantity: 1, price_data: { currency: 'usd', unit_amount: Math.round(group.totalAmount * 100), product_data: { name: 'ForTheDreamers order' } } }],
    success_url: `${origin}/checkout/success?orderId=${group.id}`,
    cancel_url: `${origin}/checkout/success?orderId=${group.id}`,
    }, { idempotencyKey: `checkout:${group.id}` });
  } catch (error) {
    if (!checkoutState.reused) {
      await prisma.$transaction(async tx => {
        const changed = await tx.orderGroup.updateMany({ where: { id: group.id, paymentStatus: 'PENDING' }, data: { paymentStatus: 'FAILED' } })
        if (!changed.count) return
        const items = await tx.orderItem.findMany({where: {order: {orderGroupId: group.id},}, select: {variantId: true, quantity: true}})
        for (const item of items) await tx.variant.update({where: {id: item.variantId}, data: {stock: {increment: item.quantity}}})
        await tx.order.updateMany({where: {orderGroupId: group.id, status: 'PENDING'}, data: {status: 'CANCELLED'}})
      })
    }
    throw error
  }
  if (!session.url) throw new Error('Unable to start payment');
  return { orderGroupId: group.id, url: session.url };
}
