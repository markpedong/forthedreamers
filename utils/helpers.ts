import { ApiResponse, TDecodedToken } from '@/constants/types'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { uuidSchema } from '@/lib/rules'
import { JWT_SECRET } from '@/constants'

export const generateResponse = <T>({
  data = null,
  error,
  status = 200,
  message = '',
  meta
}: Partial<Omit<ApiResponse<T | null>, 'success'>>) => {
  const success = status >= 200 && status < 300
  if (!success) console.error('API ERROR', error || message)
  return NextResponse.json({ data, error, success, status, message, meta }, { status })
}

export const validateToken = (token: string) => {
  if (!token) return { valid: false, error: 'Authorization token missing' }
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return { valid: true, decoded }
  } catch (error) {
    return { valid: false, error: `Invalid or expired token: ${error}` }
  }
}

export const isAuthenticated = async (request: NextRequest) => {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') || ''
  try {
    const { valid, error } = validateToken(token)
    if (!valid) return generateResponse({ status: 401, message: 'Unauthorized' })
    else {
      const decoded = jwt.verify(token, JWT_SECRET) as TDecodedToken
      return generateResponse({ data: decoded })
    }
  } catch (error) {
    return generateResponse({ error, status: 500, message: 'Server error' })
  }
}

export const validateUUID = (id: string) => {
  const result = uuidSchema.safeParse(id)
  return result.success
}
