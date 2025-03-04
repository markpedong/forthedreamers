import prisma from '@/db'
import { generateResponse, isAuthenticated, validateUUID } from '@/utils/helpers'
import { ADDRESS_TYPE } from '@prisma/client'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const body = await req.json()
  const { id } = body

  if (!validateUUID(id)) {
    return generateResponse({ error: 'Invalid address id', status: 400 })
  }

  const addressToUpdate = await prisma.addresses.findUnique({
    where: { id },
    select: { userId: true }
  })

  if (!addressToUpdate) {
    return generateResponse({ error: 'Address not found', status: 404 })
  }

  const userId = addressToUpdate.userId
  const existingDefault = await prisma.addresses.findFirst({
    where: { userId, type: ADDRESS_TYPE.DEFAULT }
  })

  if (existingDefault && existingDefault.id !== id) {
    await prisma.addresses.update({
      where: { id: existingDefault.id },
      data: { type: ADDRESS_TYPE.NONE }
    })
  }

  await prisma.addresses.update({
    where: { id },
    data: { type: ADDRESS_TYPE.DEFAULT }
  })

  return generateResponse({ message: 'Address updated successfully' })
}
