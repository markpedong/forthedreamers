import prisma from '@/db'
import { generateResponse, isAuthenticated, validateUUID } from '@/utils/helpers'
import { ADDRESS_TYPE } from '@prisma/client'
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

export async function POST(req: NextRequest) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const body = await req.json()
  const { firstName, lastName, number, landmark, street, city, state, zipCode, country, userId, type, id } = body

  await prisma.addresses.update({
    where: { id },
    data: {
      firstName,
      lastName,
      number,
      landmark,
      street,
      city,
      state,
      zipCode,
      country,
      userId,
      type: ADDRESS_TYPE[type as keyof typeof ADDRESS_TYPE]
    }
  })

  return generateResponse({ message: 'Address updated successfully' })
}
