import prisma from "@/db"
import { generateResponse, isAuthenticated } from "@/utils/helpers"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const { id } = await params
  if (!id) {
    return generateResponse({ error: 'Missing required fields', status: 400 })
  }

  const carts = await prisma.carts.findMany({
    where: { userId: id, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          images: true
        }
      },
      variation: {
        select: {
          id: true,
          label: true,
          price: true,
          discountedPrice: true
        }
      }
    },
    omit: {
      createdAt: true,
      deletedAt: true,
      updatedAt: true,
      productId: true,
      variationId: true,
      userId: true
    }
  })

  return generateResponse({ data: carts, message: 'Cart fetched successfully' })
}
