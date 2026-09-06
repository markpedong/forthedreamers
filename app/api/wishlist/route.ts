import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server-actions";
import { successResponse, errorResponse, getPaginatedData } from "@/lib/server-helper";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/**
 * GET /api/wishlist
 * Get user's wishlist with pagination.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return errorResponse("Unauthorized");
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await getPaginatedData({
      model: "wishlist",
      where: { userId: session.user.id, page, pageSize: limit },
      include: {
        product: {
          include: {
            category: true,
            seller: true,
            variants: true,
          },
        },
      },
    });

    return successResponse({
      wishlist: result.data,
      total: result.total,
      page: result.page,
      limit: result.pageSize,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    return errorResponse("Internal server error");
  }
}

/**
 * POST /api/wishlist
 * Add a product to wishlist.
 */
const wishlistSchema = z.object({
  productId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return errorResponse("Unauthorized");
    }

    const body = await request.json();
    const validated = wishlistSchema.parse(body);

    const product = await prisma.product.findUnique({
      where: { id: validated.productId },
    });

    if (!product) {
      return errorResponse("Product not found");
    }

    // Check if already in wishlist
    const existing = await prisma.wishlist.findFirst({
      where: {
        userId: session.user.id,
        productId: validated.productId,
      },
    });

    if (existing) {
      return errorResponse("Product already in wishlist");
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        productId: validated.productId,
      },
      include: {
        product: {
          include: {
            category: true,
            seller: true,
            variants: true,
          },
        },
      },
    });

    return successResponse(wishlistItem, "Added to wishlist", 201);
  } catch (error) {
    console.error("Add to wishlist error:", error);
    if (error instanceof z.ZodError) {
      return errorResponse("Invalid input data");
    }
    return errorResponse("Internal server error");
  }
}

/**
 * DELETE /api/wishlist/[id]
 * Remove a product from wishlist.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return errorResponse("Unauthorized");
    }

    const { id } = await params;

    const wishlistItem = await prisma.wishlist.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!wishlistItem) {
      return errorResponse("Wishlist item not found");
    }

    await prisma.wishlist.delete({
      where: { id },
    });

    return successResponse(null, "Removed from wishlist");
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return errorResponse("Internal server error");
  }
}
