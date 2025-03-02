import prisma from '@/db'
import { generateResponse, isAuthenticated, validateUUID } from '@/utils/helpers'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const { id } = await params
  if (!validateUUID(id)) {
    return generateResponse({ error: 'Invalid user id', status: 400 })
  }

  const user = await prisma.users.findUnique({
    where: { id }
  })

  return generateResponse({ data: user, message: 'User fetched successfully' })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authRes = await isAuthenticated(req)
  if (!authRes.ok) return authRes

  const { id } = await params
  if (!validateUUID(id)) {
    return generateResponse({ error: 'Invalid user id', status: 400 })
  }

  const body = await req.json()
  const { firstName, lastName, birthday } = body

  const user = await prisma.users.update({
    where: { id },
    data: { firstName, lastName, birthday }
  })

  return generateResponse({ data: user, message: 'User updated successfully' })
}