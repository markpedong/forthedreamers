import prisma from "@/db"
import { generateResponse, isAuthenticated, validateUUID } from "@/utils/helpers"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes


  const { id } = await params
  if (!validateUUID(id)) {
    return generateResponse({ error: 'Invalid review id', status: 400 })
  }

  const reviews = await prisma.reviews.findMany({
    where: { userId: id, deletedAt: null },
    include: { product: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return generateResponse({ data: reviews, message: 'Reviews fetched successfully' })
}