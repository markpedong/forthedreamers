import prisma from '@/db'
import { generateResponse, isAuthenticated, validateUUID } from '@/utils/helpers'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import authOptions from '../auth/[...nextauth]/options'
import { ADDRESS_TYPE } from '@prisma/client'

export async function POST(req: NextRequest) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const body = await req.json()
  const { firstName, lastName, number, landmark, street, city, state, zipCode, country, userId, addressType } = body
  const address = await prisma.addresses.create({
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
      type: ADDRESS_TYPE[addressType as keyof typeof ADDRESS_TYPE]

    }
  })

  return generateResponse({ data: address, message: 'Address created successfully' })
}

export async function GET(req: NextRequest) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const session = await getServerSession(authOptions)
  if (!session) {
    return generateResponse({ error: 'Unauthorized', status: 401 })
  }

  if (!validateUUID(session.user.id)) {
    return generateResponse({ error: 'Invalid address id', status: 400 })
  }

  const address = await prisma.addresses.findMany({
    where: { userId: session.user.id },
  })

  return generateResponse({ data: address, message: 'Address fetched successfully' })
}