import {NextRequest, NextResponse} from 'next/server'
import {z} from 'zod'
import {USER_ROLE} from '@/generated/prisma'
import {getSession, signIn, signOut} from '@/lib/services/auth'

const schema = z.object({email: z.email(), password: z.string().min(1), audience: z.enum(['user', 'seller'])})

export const POST = async (request: NextRequest) => {
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({success: false, message: 'Check your sign-in details'}, {status: 400})
  try {
    await signIn(parsed.data.email, parsed.data.password)
    const session = await getSession()
    if (!session) throw new Error('Unable to sign in. Please try again.')
    const allowed = parsed.data.audience === 'user'
      ? session.user.role === USER_ROLE.USER
      : session.user.role !== USER_ROLE.USER
    if (!allowed) {
      await signOut()
      return NextResponse.json({
        success: false,
        message: `You are not authorized to access this page, please use the ${parsed.data.audience === 'user' ? 'seller' : 'user'} panel.`
      }, {status: 403})
    }
    return NextResponse.json({success: true, data: {role: session.user.role}})
  } catch (error) {
    return NextResponse.json({success: false, message: error instanceof Error ? error.message : 'Unable to sign in'}, {status: 400})
  }
}
