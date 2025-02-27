import prisma from '@/db'
import jwt from 'jsonwebtoken'

export const generateAccessToken = (userId: string, email: string) => {
  return jwt.sign({ id: userId, email }, process.env.AUTH_SECRET!, {
    expiresIn: '60s'
  })
}

export const generateRefreshToken = () => {
  return jwt.sign({}, process.env.AUTH_SECRET!, {
    expiresIn: '7d'
  })
}

export async function saveRefreshToken(userId: string, refreshToken: string) {
  await prisma.users.update({
    where: { id: userId },
    data: { refreshToken }
  })
}
