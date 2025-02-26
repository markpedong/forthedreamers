import { ApiResponseType } from '@/constants/types'
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
