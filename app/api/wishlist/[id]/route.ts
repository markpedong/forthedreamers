import prisma from "@/db";
import { generateResponse, isAuthenticated, validateUUID } from "@/utils/helpers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes


  const { id } = await params
  if (!validateUUID(id)) {
    return generateResponse({ error: 'Invalid wishlist id', status: 400 })
  }

  const wishlist = await prisma.wishlists.findMany({
    where: { userId: id },
    include: { product: { select: { images: true, name: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return generateResponse({ data: wishlist, message: 'Wishlist fetched successfully' })
}