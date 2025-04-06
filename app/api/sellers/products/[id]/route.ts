import prisma from "@/db";
import { generateResponse, isAuthenticated, validateUUID } from "@/utils/helpers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const { id } = await params
  if (!validateUUID(id)) {
    return generateResponse({ error: 'Invalid product id', status: 400 })
  }

  const sellerProducts = await prisma.products.findMany({
    where: { sellerID: id, deletedAt: null },
    select: {
      id: true,
      name: true,
      images: true,
      createdAt: true,
      description: true,
      variations: { select: { price: true, discountedPrice: true, id: true, label: true, stock: true } },
      reviews: { select: { rating: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return generateResponse({ data: sellerProducts, message: 'Products fetched successfully' })
}