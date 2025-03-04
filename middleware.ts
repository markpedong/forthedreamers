import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { AUTH_SECRET } from './constants'

export const middleware = async (request: NextRequest) => {
  const token = await getToken({ req: request, secret: AUTH_SECRET })
  const path = request.nextUrl.pathname
  const protectedRoutes = ['/profile', '/checkout', '/cart']

  if (token && path === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!token && protectedRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'] // Applies to all pages except static files
}
