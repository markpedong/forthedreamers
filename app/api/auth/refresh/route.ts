import { NextRequest } from 'next/server'
import prisma from '@/db'
import { generateAccessToken } from '@/utils/tokens'
import { generateResponse } from '@/utils/helpers'

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json()
    if (!refreshToken) {
      return generateResponse({ error: 'No refresh token provided', status: 401 })
    }

    const user = await prisma.users.findFirst({
      where: { refreshToken }
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
