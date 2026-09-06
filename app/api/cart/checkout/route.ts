import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/server-helper";
import { getSession } from "@/lib/server-actions";

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return errorResponse("Unauthorized");

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.user.id },
      include: {
        variant: {
          include: {
            product: {
              include: {
                seller: true,
              },
            },
          },
        },
        product: true,
      },
    });

    if (cartItems.length === 0) return errorResponse("Cart is empty");

    // Validate stock for every item
    const outOfStockItems: Array<{ cartItemId: string; variantId: string; productName: string; variantName: string; requested: number; available: number }> = [];

    for (const item of cartItems) {
      const variant = await prisma.variant.findUnique({
        where: { id: item.variantId },
      });
      if (!variant) {
        outOfStockItems.push({
          cartItemId: item.id,
          variantId: item.variantId,
          productName: item.product?.name ?? "Unknown",
          variantName: item.variant.name,
          requested: item.quantity,
          available: 0,
        });
        continue;
      }
      if (variant.stock < item.quantity) {
        outOfStockItems.push({
          cartItemId: item.id,
          variantId: item.variantId,
          productName: item.product?.name ?? "Unknown",
          variantName: item.variant.name,
          requested: item.quantity,
          available: variant.stock,
        });
      }
    }

    if (outOfStockItems.length > 0) {
      return successResponse(
        {
          error: "OUT_OF_STOCK",
          items: outOfStockItems,
        },
        "Some items are out of stock",
        400
      );
    }

    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => {
      const price = item.variant.discountedPrice ?? item.variant.price;
      return sum + price * item.quantity;
    }, 0);

    // Group by seller
    const sellerGroups = new Map<string, typeof cartItems>();
    for (const item of cartItems) {
      const sellerId = item.variant.product.sellerId;
      if (!sellerGroups.has(sellerId)) {
        sellerGroups.set(sellerId, []);
      }
      sellerGroups.get(sellerId)!.push(item);
    }

    // Use transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create OrderGroup
      const orderGroup = await tx.orderGroup.create({
        data: {
          userId: user.user.id,
          totalAmount,
          paymentStatus: "PENDING",
        },
      });

      const orders: Array<{ id: string; sellerId: string; amount: number }> = [];

      for (const [sellerId, items] of sellerGroups) {
        const sellerOrderTotal = items.reduce((sum, item) => {
          const price = item.variant.discountedPrice ?? item.variant.price;
          return sum + price * item.quantity;
        }, 0);

        const order = await tx.order.create({
          data: {
            userId: user.user.id,
            sellerId,
            orderGroupId: orderGroup.id,
            total: sellerOrderTotal,
            status: "PENDING",
            orderItems: {
              create: items.map((item) => {
                const price = item.variant.discountedPrice ?? item.variant.price;
                return {
                  variantId: item.variantId,
                  productId: item.variant.productId,
                  quantity: item.quantity,
                  priceAtPurchase: price,
                  discountedPriceAtPurchase: item.variant.discountedPrice ?? null,
                  finalPriceAfterDiscount: price * item.quantity,
                };
              }),
            },
          },
          include: {
            orderItems: true,
          },
        });

        orders.push({
          id: order.id,
          sellerId: sellerId,
          amount: sellerOrderTotal,
        });

        // Deduct stock for each item
        for (const item of items) {
          await tx.variant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      // Clear cart items
      await tx.cartItem.deleteMany({
        where: { userId: user.user.id },
      });

      return { orderGroup, orders };
    });

    // Create Stripe PaymentIntent
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // cents
      currency: "usd",
      metadata: { orderGroupId: result.orderGroup.id },
      automatic_payment_methods: { enabled: true },
    });

    return successResponse(
      {
        data: {
          orderGroupId: result.orderGroup.id,
          orders: result.orders,
          paymentIntentClientSecret: paymentIntent.client_secret,
        },
      },
      "Checkout successful",
      200
    );
  } catch (err: unknown) {
    return errorResponse(err);
  }
}
