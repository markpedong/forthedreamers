import {NextResponse} from 'next/server'
import {getCurrentUserData} from '@/lib/services/auth'

export const GET = async () => {
  const user = await getCurrentUserData()
  return user
    ? NextResponse.json({success: true, data: user})
    : NextResponse.json({success: false, message: 'Unauthorized'}, {status: 401})
}
