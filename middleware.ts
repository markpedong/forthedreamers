import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export const middleware = async (request: NextRequest) => {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
  const path = request.nextUrl.pathname
  const isRootPath = path === '/'

  if (!token && !isRootPath && path !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && isRootPath) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'] // Applies to all pages except static files
}
