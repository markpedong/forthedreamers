import prisma from "@/db";
import { generateResponse, isAuthenticated } from "@/utils/helpers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const id = (await params).id
  const soldProducts = await prisma.orders.findMany({
    where: {
      orderItems: {
        some: {
          product: {
            sellerID: id
          }
        }
      }
    },
    include: {
      user: { select: { firstName: true, lastName: true } },
      orderItems: {
        include: { product: { select: { name: true, id: true, images: true } } }
      },
      address: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return generateResponse({ data: soldProducts, message: 'Products fetched successfully' })
}