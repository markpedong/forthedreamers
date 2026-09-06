import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server-actions";
import { successResponse, errorResponse } from "@/lib/server-helper";
import { prisma } from "@/lib/prisma";

// Simple coupon configuration (can be extended to use database)
const COUPONS = [
  {
    code: "WELCOME10",
    type: "percentage" as const,
    value: 10,
    minOrderAmount: 50,
    maxDiscount: 20,
    isActive: true,
    applicableCategories: [] as string[],
    applicableProducts: [] as string[],
  },
  {
    code: "SAVE20",
    type: "fixed" as const,
    value: 20,
    minOrderAmount: 100,
    maxDiscount: 20,
    isActive: true,
    applicableCategories: [] as string[],
    applicableProducts: [] as string[],
  },
];

/**
 * GET /api/coupons
 * Get all coupons (admin) or validate a coupon (user).
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse("Unauthorized");
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code") || "";
    const isAdmin = session.user.role === "ADMIN";

    if (code) {
      // Validate a specific coupon
      const coupon = COUPONS.find((c) => c.code === code.toUpperCase());
      return successResponse({ coupons: coupon ? [coupon] : [] });
    } else {
      // Get all coupons (admin only)
      if (!isAdmin) {
        return errorResponse("Unauthorized");
      }
      return successResponse({ coupons: COUPONS });
    }
  } catch (error) {
    console.error("Get coupons error:", error);
    return errorResponse("Internal server error");
  }
}

/**
 * POST /api/coupons/validate
 * Validate a coupon code.
 */
export async function POST_VALIDATE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return errorResponse("Unauthorized");
    }

    const body = await request.json();
    const { code, orderTotal, categories, products } = body;

    if (!code) {
      return errorResponse("Coupon code required");
    }

    const coupon = COUPONS.find((c) => c.code === code.toUpperCase());

    if (!coupon) {
      return errorResponse("Invalid coupon code");
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return errorResponse("Coupon is not active");
    }

    // Check minimum order amount
    if (coupon.minOrderAmount && orderTotal < coupon.minOrderAmount) {
      return errorResponse(`Minimum order amount is $${coupon.minOrderAmount}`);
    }

    // Check category restrictions
    if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
      const hasApplicableCategory = categories?.some((cat: string) =>
        coupon.applicableCategories.includes(cat)
      );
      if (!hasApplicableCategory) {
        return errorResponse("Coupon not applicable to items in cart");
      }
    }

    // Check product restrictions
    if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
      const hasApplicableProduct = products?.some((prod: string) =>
        coupon.applicableProducts.includes(prod)
      );
      if (!hasApplicableProduct) {
        return errorResponse("Coupon not applicable to items in cart");
      }
    }

    // Calculate discount
    const discountValue =
      coupon.type === "percentage"
        ? orderTotal * (coupon.value / 100)
        : coupon.value;

    const finalDiscount = coupon.maxDiscount
      ? Math.min(discountValue, coupon.maxDiscount)
      : discountValue;

    return successResponse({
      valid: true,
      coupon,
      discount: finalDiscount,
      finalTotal: orderTotal - finalDiscount,
    });
  } catch (error) {
    console.error("Validate coupon error:", error);
    return errorResponse("Internal server error");
  }
}
