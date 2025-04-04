import prisma from '@/db'
import { generateResponse, isAuthenticated, validateUUID } from '@/utils/helpers'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // const authRes = await isAuthenticated(req)
  // if (!authRes.ok) return authRes

  const { id } = await params
  if (!validateUUID(id)) {
    return generateResponse({ error: 'Invalid seller id', status: 400 })
  }

  try {
    const seller = await prisma.users.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            variations: { select: { price: true, discountedPrice: true, id: true, label: true, stock: true } },
            reviews: { select: { rating: true } }
          },
          where: { deletedAt: null }
        }
      }
    })

    return generateResponse({ data: seller, message: 'Seller fetched successfully' })
  } catch (error) {
    return generateResponse({ status: 400, error })
  }
}
