import prisma from "@/db"
import { generateResponse, isAuthenticated } from "@/utils/helpers"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const id = (await params).id
  const reviews = await prisma.reviews.findMany({
    where: {
      product: {
        sellerID: id
      }
    },
    select: {
      id: true,
      comment: true,
      rating: true,
      product: { select: { name: true } },
      user: { select: { firstName: true, lastName: true, image: true } },
      createdAt: true
    }
  })

  return generateResponse({ data: reviews, message: 'Reviews fetched successfully' })
}