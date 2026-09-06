import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse } from "@/lib/server-helper";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature") ?? "";
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return errorResponse("Stripe webhook secret not configured");
    }

    let event;
    try {
      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: unknown) {
      return errorResponse("Webhook signature verification failed");
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as { metadata: Record<string, string> };
      const orderGroupId = paymentIntent.metadata?.orderGroupId;

      if (orderGroupId) {
        await prisma.orderGroup.updateMany({
          where: { id: orderGroupId },
          data: { paymentStatus: "PAID" },
        });

        await prisma.order.updateMany({
          where: { orderGroupId },
          data: { status: "PAID" },
        });
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    return errorResponse(err);
  }
}

export const GET = () =>
  new Response(JSON.stringify({ error: "POST only" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
