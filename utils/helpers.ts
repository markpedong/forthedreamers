import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { ApiResponseType } from '@/constants/types'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export const generateResponse = <T>({
  data = null,
  error,
  status = 200,
  message = '',
  meta
}: Partial<Omit<ApiResponseType<T | null>, 'success'>>) => {
  const success = status >= 200 && status < 300
  if (!success) console.error('API ERROR', error || message)
  return NextResponse.json({ data, error, success, status, message, meta }, { status })
}

export const isAuthenticated = async (req: NextRequest) => {
  const session = await getServerSession(authOptions)
  if (session) return { user: session.user }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 }
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, `${process.env.AUTH_SECRET}`)
    return { user: decoded }
  } catch (error) {
    return { error: 'Invalid or expired token', status: 403 }
  }
}
