import { setWishlist } from '@/lib/actions/wishlist';
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server-actions";
import { successResponse, errorResponse, getPaginatedData } from "@/lib/server-helper";

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
      orderBy: { addedAt: 'desc' },
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
export async function POST(request: NextRequest) {
  const result = await setWishlist((await request.json()).productId, true);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
// Explicit productId query parameter; this route has no dynamic [id] segment.
export async function DELETE(request: NextRequest) {
  const result = await setWishlist(request.nextUrl.searchParams.get('productId') ?? '', false);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
