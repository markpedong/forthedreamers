import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server-actions";
import { successResponse, errorResponse } from "@/lib/server-helper";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/shipping/calculate
 * Calculate shipping cost based on region and items.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return errorResponse("Unauthorized");
    }

    const body = await request.json();
    const { region, items } = body;

    if (!region || !items) {
      return errorResponse("Missing required fields");
    }

    // Simple shipping calculation (can be extended with real methods)
    const SHIPPING_RATES: Record<string, number> = {
      domestic: 5.99,
      international: 12.99,
      express: 15.99,
    };

    const shippingCost = SHIPPING_RATES[region] || 5.99;
    const totalItems = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const totalShipping = shippingCost * Math.ceil(totalItems / 5); // Free shipping for every 5 items

    return successResponse({
      shippingCost: totalShipping,
      estimatedDelivery: new Date(
        Date.now() + (region === "express" ? 2 : region === "international" ? 14 : 5) * 24 * 60 * 60 * 1000
      ),
      regions: Object.keys(SHIPPING_RATES),
    });
  } catch (error) {
    console.error("Calculate shipping error:", error);
    return errorResponse("Internal server error");
  }
}
