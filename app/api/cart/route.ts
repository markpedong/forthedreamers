import { generateResponse, isAuthenticated } from '@/utils/helpers'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import authOptions from '../auth/[...nextauth]/options'
import prisma from '@/db'

export async function POST(req: NextRequest) {
  try {
    const authRes = await isAuthenticated(req)
    if (!authRes.ok) return authRes

    const session = await getServerSession(authOptions)
    const body = await req.json()
    const { productId, quantity, variationId } = body

    const existingCart = await prisma.carts.findFirst({
      where: {
        productId,
        variationId,
        userId: `${session?.user.id}`
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
          userId: `${session?.user.id}`
        }
      })
    }

    return generateResponse({
      message: 'Product added to cart successfully'
    })
  } catch (error) {
    return generateResponse({ error: 'Server error', status: 500 })
  }
}
