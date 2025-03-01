import prisma from '@/db'
import { generateAccessToken } from '@/utils/tokens'
import { generateResponse } from '@/utils/helpers'
import { getServerSession } from 'next-auth'
import authOptions from '../[...nextauth]/options'

export async function POST() {
  try {
    const currSession = await getServerSession(authOptions)

    const user = await prisma.users.findFirst({
      where: { id: currSession?.user?.id }
    })

    if (!user) {
      return generateResponse({ error: 'Invalid refresh token', status: 401 })
    }

    const newAccessToken = generateAccessToken(user.id, `${user.email}`)

    return generateResponse({ data: { accessToken: newAccessToken }, status: 200 })
  } catch (error) {
    return generateResponse({ error: 'Server error', status: 500 })
  }
}
