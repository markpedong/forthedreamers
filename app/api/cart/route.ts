import prisma from "@/db";
import { generateResponse, isAuthenticated } from "@/utils/helpers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const { productId, quantity, userId, variationId } = await req.json()
  if (!productId || !quantity || !userId || !variationId) {
    return generateResponse({ error: 'Missing required fields', status: 400 })
  }

  const existingCart = await prisma.carts.findFirst({
    where: {
      productId,
      variationId,
      userId: userId
    }
  })

  if (existingCart) {
    await prisma.carts.update({
      where: { id: existingCart.id },
      data: {
        quantity: existingCart.quantity + 1
      }
    })
  } else {
    await prisma.carts.create({
      data: {
        productId,
        quantity,
        variationId,
        userId: userId
      }
    })
  }

  return generateResponse({ message: 'Product added to cart successfully' })
}

export async function DELETE(req: NextRequest) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const { id } = await req.json()
  if (!id) {
    return generateResponse({ error: 'Missing required fields', status: 400 })
  }

  await prisma.carts.delete({
    where: { id }
  })

  return generateResponse({ message: 'Product removed from cart successfully' })
}