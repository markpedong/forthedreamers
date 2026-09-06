import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server-actions";
import { successResponse, errorResponse, getPaginatedData, buildServerQuery } from "@/lib/server-helper";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/products/search
 * Search products with filters, sorting, and pagination.
 * Query params:
 *   q - search query (fuzzy on name, description)
 *   category - filter by category slug
 *   brand - filter by brand
 *   minPrice, maxPrice - price range
 *   minRating, maxRating - rating range
 *   inStock - boolean: 1 or 0
 *   sortBy - name, price, rating, sold, createdAt
 *   order - asc, desc
 *   page, limit - pagination
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse("Unauthorized");
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "Infinity");
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const maxRating = parseFloat(searchParams.get("maxRating") || "5");
    const inStock = searchParams.get("inStock");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build filters
    const where: any = { status: "ACTIVE" };

    // Full-text search on name and description
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (brand) {
      where.brand = { contains: brand, mode: "insensitive" };
    }

    // Price range
    where.OR = where.OR || [];
    where.OR.push({
      basePrice: { gte: minPrice, lte: maxPrice },
    });

    // Rating range
    where.rating = { gte: minRating, lte: maxRating };

    // Stock filter
    if (inStock === "1") {
      where.stock = { gt: 0 };
    } else if (inStock === "0") {
      where.stock = { lte: 0 };
    }

    // Build sort
    const orderBy: any = {};
    orderBy[sortBy] = order;

    // Get products with pagination
    const result = await getPaginatedData({
      model: "product",
      where: { ...where, page, pageSize: limit },
      orderBy,
    });

    // Get categories for filter options
    const categories = await prisma.category.findMany({
      select: { name: true },
    });

    // Get brands (unique)
    const brands = await prisma.product.findMany({
      where: { brand: { not: null } },
      select: { brand: true },
      distinct: ["brand"],
    });

    return successResponse({
      products: result.data,
      total: result.total,
      page: result.page,
      limit: result.pageSize,
      categories: categories.map((c) => c.name),
      brands: brands.map((b) => b.brand).filter(Boolean),
    });
  } catch (error) {
    console.error("Search API error:", error);
    return errorResponse("Internal server error");
  }
}
