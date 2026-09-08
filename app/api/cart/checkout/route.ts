import {NextResponse} from 'next/server'
import {getSession} from '@/lib/services/auth'
import {checkout} from '@/lib/services/checkout'

export const POST = async () => {
  const session = await getSession()
  if (!session) return NextResponse.json({success: false, message: 'Please sign in'}, {status: 401})
  try {
    return NextResponse.json({success: true, message: 'Order confirmed', data: await checkout(session.user.id)})
  } catch (error) {
    return NextResponse.json({success: false, message: error instanceof Error ? error.message : 'Failed to place order'}, {status: 400})
  }
}
