import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { AUTH_SECRET } from './constants'
import { USER_ROLE } from '@prisma/client'

export const middleware = async (request: NextRequest) => {
  const token = await getToken({ req: request, secret: AUTH_SECRET })
  const path = request.nextUrl.pathname

  const protectedRoutes = ['/profile', '/checkout', '/cart']
  const sellerRestrictedRoutes = ['/profile'] // Sellers cannot access profile
  const userRestrictedRoutes = ['/seller/dashboard'] // Users cannot access seller dashboard

  if (token) {
    const userRole = token.role

    if (userRole === USER_ROLE.SELLER && sellerRestrictedRoutes.includes(path)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    if (userRole === USER_ROLE.USER && userRestrictedRoutes.includes(path)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    if (path === '/login') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } else {
    if (protectedRoutes.includes(path) || userRestrictedRoutes.includes(path)) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
}
