import {NextRequest, NextResponse} from 'next/server'
import {z} from 'zod'
import {sendForgotPasswordEmail} from '@/lib/services/auth'

const schema = z.object({email: z.email(), redirectTo: z.string().startsWith('/').optional()})

export const POST = async (request: NextRequest) => {
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({success: false, message: 'Enter a valid email'}, {status: 400})
  try {
    await sendForgotPasswordEmail(parsed.data.email, parsed.data.redirectTo)
    return NextResponse.json({success: true})
  } catch (error) {
    return NextResponse.json({success: false, message: error instanceof Error ? error.message : 'Unable to send reset email'}, {status: 400})
  }
}
