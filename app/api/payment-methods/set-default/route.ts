import prisma from '@/db'
import { generateResponse, isAuthenticated, validateUUID } from '@/utils/helpers'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const body = await req.json()
  const { id } = body

  if (!validateUUID(id)) {
    return generateResponse({ error: 'Invalid payment method id', status: 400 })
  }

  const paymentMethodToUpdate = await prisma.paymentMethods.findUnique({
    where: { id },
    select: { userId: true }
  })

  if (!paymentMethodToUpdate) {
    return generateResponse({ error: 'Payment Method not found', status: 404 })
  }

  const userId = paymentMethodToUpdate.userId
  const existingDefault = await prisma.paymentMethods.findFirst({
    where: { userId, isDefault: true }
  })

  if (existingDefault && existingDefault.id !== id) {
    await prisma.paymentMethods.update({
      where: { id: existingDefault.id },
      data: { isDefault: false }
    })
  }

  await prisma.paymentMethods.update({
    where: { id },
    data: { isDefault: true }
  })

  return generateResponse({ message: 'Payment method updated successfully' })
}
