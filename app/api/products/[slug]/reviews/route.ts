import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server-actions";
import { successResponse, errorResponse } from "@/lib/server-helper";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/**
 * GET /api/products/[slug]/reviews
 * Get reviews for a product with pagination and filtering.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const rating = parseInt(searchParams.get("rating") || "0");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        reviews: {
          where: rating > 0 ? { rating } : undefined,
          orderBy: { [sortBy]: order },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return errorResponse("Product not found");
    }

    const total = await prisma.review.count({
      where: { productId: product.id, rating: rating > 0 ? rating : undefined },
    });

    return successResponse({
      reviews: product.reviews,
      total,
      page,
      limit,
      averageRating: product.rating,
      reviewCount: product.reviewCount,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return errorResponse("Internal server error");
  }
}

/**
 * POST /api/products/[slug]/reviews
 * Submit a review for a product.
 */
const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().max(1000).optional(),
  variantId: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return errorResponse("Unauthorized");
    }

    const { slug } = await params;
    const body = await request.json();
    const validated = reviewSchema.parse(body);

    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return errorResponse("Product not found");
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: product.id,
        userId: session.user.id,
      },
    });

    if (existingReview) {
      return errorResponse("You have already reviewed this product");
    }

    const review = await prisma.review.create({
      data: {
        productId: product.id,
        userId: session.user.id,
        rating: validated.rating,
        title: validated.title,
        comment: validated.comment,
        variantId: validated.variantId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Update product rating and review count
    const reviews = await prisma.review.findMany({
      where: { productId: product.id },
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.product.update({
      where: { id: product.id },
      data: {
        rating: avgRating,
        reviewCount: reviews.length,
      },
    });

    return successResponse(review, "Review submitted successfully", 201);
  } catch (error) {
    console.error("Submit review error:", error);
    if (error instanceof z.ZodError) {
      return errorResponse("Invalid input data");
    }
    return errorResponse("Internal server error");
  }
}
