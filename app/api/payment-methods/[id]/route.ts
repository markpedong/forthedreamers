import prisma from '@/db'
import { generateResponse, isAuthenticated, validateUUID } from '@/utils/helpers'
import { NextRequest } from 'next/server'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const { id } = await params
  if (!validateUUID(id)) {
    return generateResponse({ error: 'Invalid payment method id', status: 400 })
  }

  await prisma.paymentMethods.update({
    where: { id },
    data: { deletedAt: new Date() }
  })

  return generateResponse({ message: 'Payment method deleted successfully' })
}
