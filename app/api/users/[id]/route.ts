import prisma from '@/db'
import { generateResponse, isAuthenticated } from '@/utils/helpers'
import { NextRequest } from 'next/server'

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const auth = await isAuthenticated(req)
  if (auth.error) return generateResponse({ error: auth.error, status: auth.status })

  const user = await prisma.users.findUnique({
    where: { id: params.id }
  })

  return generateResponse({ data: user })
}
