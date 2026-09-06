import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { invalidateCatalog } from '@/lib/cache';
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) return new NextResponse('Webhook unavailable', { status: 503 });
  let event: Stripe.Event;
  try { event = new Stripe(secret).webhooks.constructEvent(await req.text(), req.headers.get('stripe-signature') ?? '', webhookSecret); }
  catch { return new NextResponse('Invalid signature', { status: 400 }); }
  try {
    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object;
      const id = intent.metadata.orderGroupId;
      if (id) await prisma.$transaction(async tx => {
        const group = await tx.orderGroup.findUnique({ where: { id }, select: { totalAmount: true } });
        if (!group || intent.currency !== 'usd' || intent.amount_received !== Math.round(group.totalAmount * 100)) throw new Error('Payment mismatch');
        const updated = await tx.orderGroup.updateMany({ where: { id, paymentStatus: 'PENDING' }, data: { paymentStatus: 'PAID' } });
        if (updated.count) await tx.order.updateMany({ where: { orderGroupId: id, status: 'PENDING' }, data: { status: 'PAID' } });
      });
    }
    if (event.type === 'checkout.session.expired') {
      const id = event.data.object.metadata?.orderGroupId;
      if (id) {
        await prisma.$transaction(async tx => {
          const changed = await tx.orderGroup.updateMany({ where: { id, paymentStatus: 'PENDING' }, data: { paymentStatus: 'FAILED' } });
          if (!changed.count) return;
          const items = await tx.orderItem.findMany({ where: { order: { orderGroupId: id } }, select: { variantId: true, quantity: true } });
          for (const item of items) await tx.variant.update({ where: { id: item.variantId }, data: { stock: { increment: item.quantity } } });
          await tx.order.updateMany({ where: { orderGroupId: id, status: 'PENDING' }, data: { status: 'CANCELLED' } });
        });
        await invalidateCatalog();
      }
    }
    return NextResponse.json({ received: true });
  } catch { return new NextResponse('Unable to process webhook', { status: 500 }); }
}
