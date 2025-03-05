import prisma from '@/db'
import { generateResponse, isAuthenticated } from '@/utils/helpers'
import { PAYMENT_TYPE } from '@prisma/client'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const isAuthRes = await isAuthenticated(req)
  if (!isAuthRes.ok) return isAuthRes

  const body = await req.json()

  await prisma.paymentMethods.create({
    data: {
      ...body,
      type: PAYMENT_TYPE[body.type as keyof typeof PAYMENT_TYPE]
    }
  })

  return generateResponse({ data: body, message: 'Payment method created successfully' })
}
