import prisma from '@/db'
import { generateResponse, isAuthenticated, validateUUID } from '@/utils/helpers'
import { NextRequest } from 'next/server'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const { id } = await params
  if (!validateUUID(id)) {
    return generateResponse({ error: 'Invalid address id', status: 400 })
  }
  const address = await prisma.addresses.update({
    where: { id },
    data: { deletedAt: new Date() }
  })

  return generateResponse({ data: address, message: 'Address deleted successfully' })
}
