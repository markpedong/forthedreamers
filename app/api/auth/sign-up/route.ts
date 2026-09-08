import {NextRequest, NextResponse} from 'next/server'
import {z} from 'zod'
import {signUp} from '@/lib/services/auth'

const schema = z.object({name: z.string().trim().min(1).max(100), email: z.email(), password: z.string().min(8).max(128)})

export const POST = async (request: NextRequest) => {
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({success: false, message: 'Check your signup details'}, {status: 400})
  try {
    await signUp(parsed.data.email, parsed.data.password, parsed.data.name)
    return NextResponse.json({success: true, message: 'Account created successfully!'})
  } catch (error) {
    return NextResponse.json({success: false, message: error instanceof Error ? error.message : 'Unable to sign up'}, {status: 400})
  }
}
