import prisma from '@/db'
import { generateResponse, isAuthenticated, validateUUID } from '@/utils/helpers'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await isAuthenticated(req)
  const { id } = await params

  if (auth.error) return generateResponse({ error: auth.error, status: auth.status })

  if (!validateUUID(id)) {
    return generateResponse({ error: 'Invalid user id', status: 400 })
  }

  const user = await prisma.users.findUnique({
    where: { id }
  })

  return generateResponse({ data: user, message: 'User fetched successfully' })
}
