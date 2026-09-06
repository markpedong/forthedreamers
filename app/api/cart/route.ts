import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/server-helper";
import { getSession } from "@/lib/server-actions";

export async function GET(req: NextRequest) {
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
                seller: { omit: { createdAt: true, updatedAt: true, id: true, userId: true } },
              },
            },
          },
        },
      },
    });

    return successResponse({ data: cartItems });
  } catch (err: unknown) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { variantId, quantity = 1 } = await req.json();

    if (!variantId) return errorResponse("variantId is required");
    if (!quantity || quantity < 1) return errorResponse("Quantity must be at least 1");

    const user = await getSession();
    if (!user) return errorResponse("Unauthorized");

    const variant = await prisma.variant.findUnique({
      where: { id: variantId },
      include: {
        product: {
          include: {
            seller: true,
          },
        },
      },
    });

    if (!variant) return errorResponse("Variant not found");

    if (variant.stock < quantity) {
      return errorResponse(`Insufficient stock. Available: ${variant.stock}`);
    }

    const cartItem = await prisma.cartItem.upsert({
      where: { userId_variantId: { userId: user.user.id, variantId } },
      update: { quantity: { increment: quantity } },
      create: {
        userId: user.user.id,
        variantId,
        quantity,
        productId: variant.productId,
      },
      include: {
        variant: {
          include: {
            product: {
              include: {
                seller: { omit: { createdAt: true, updatedAt: true, id: true, userId: true } },
              },
            },
          },
        },
      },
    });

    return successResponse({ data: cartItem }, "Added to cart", 201);
  } catch (err: unknown) {
    return errorResponse(err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { cartItemId, quantity } = await req.json();

    if (!cartItemId) return errorResponse("cartItemId is required");
    if (quantity === undefined || quantity < 1) return errorResponse("Quantity must be at least 1");

    const user = await getSession();
    if (!user) return errorResponse("Unauthorized");

    const existingItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!existingItem) return errorResponse("Cart item not found");
    if (existingItem.userId !== user.user.id) return errorResponse("Unauthorized");

    const variant = await prisma.variant.findUnique({
      where: { id: existingItem.variantId },
    });

    if (!variant) return errorResponse("Variant not found");
    if (variant.stock < quantity) {
      return errorResponse(`Insufficient stock. Available: ${variant.stock}`);
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        variant: {
          include: {
            product: {
              include: {
                seller: { omit: { createdAt: true, updatedAt: true, id: true, userId: true } },
              },
            },
          },
        },
      },
    });

    return successResponse({ data: updatedItem }, "Cart updated");
  } catch (err: unknown) {
    return errorResponse(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cartItemId = searchParams.get("id");

    if (!cartItemId) return errorResponse("cartItemId is required");

    const user = await getSession();
    if (!user) return errorResponse("Unauthorized");

    const existingItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!existingItem) return errorResponse("Cart item not found");
    if (existingItem.userId !== user.user.id) return errorResponse("Unauthorized");

    await prisma.cartItem.delete({ where: { id: cartItemId } });

    return successResponse(null, "Removed from cart");
  } catch (err: unknown) {
    return errorResponse(err);
  }
}
