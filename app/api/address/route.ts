import prisma from '@/db'
import { generateResponse, isAuthenticated, validateUUID } from '@/utils/helpers'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const body = await req.json()
  console.log("body", body)
  const { firstName, lastName, number, landmark, street, city, state, zipCode, country, userId } = body
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
      userId
    }
  })

  return generateResponse({ data: address, message: 'Address created successfully' })
}
