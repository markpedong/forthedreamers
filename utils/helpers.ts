import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { ApiResponseType } from '@/constants/types'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

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

export const isAuthenticated = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return generateResponse({ error: 'Unauthorized', status: 401 })
  }

  return null
}
