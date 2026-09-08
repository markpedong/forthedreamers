import {NextRequest, NextResponse} from 'next/server'
import {z} from 'zod'
import {getSession, socialLinkUrl} from '@/lib/services/auth'

const schema = z.object({provider: z.enum(['google', 'github']), next: z.string().startsWith('/').max(200)})

export const POST = async (request: NextRequest) => {
  if (!await getSession()) return NextResponse.json({success: false, message: 'Unauthorized'}, {status: 401})
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({success: false, message: 'Invalid account link request'}, {status: 400})
  try {
    return NextResponse.json({success: true, data: {url: await socialLinkUrl(parsed.data.provider, parsed.data.next)}})
  } catch (error) {
    return NextResponse.json({success: false, message: error instanceof Error ? error.message : 'Unable to link account'}, {status: 400})
  }
}
