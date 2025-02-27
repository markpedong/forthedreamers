import { generateResponse, isAuthenticated } from '@/utils/helpers'
import { NextRequest } from 'next/server'

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const auth = await isAuthenticated()
  if (auth) return auth

  return generateResponse({ data: params.id })
}
