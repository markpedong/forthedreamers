import { USER_ROLE } from '@prisma/client'
import { getToken } from 'next-auth/jwt'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { AUTH_SECRET } from './constants'

export const middleware = async (request: NextRequest, event: NextFetchEvent) => {
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

    if (path === '/checkout') {
      const cartItems = await fetch(`${process.env.NEXTAUTH_URL}/api/cart/${token.id}`)

      if ((await cartItems.json())?.data.length === 0) {
        return NextResponse.redirect(new URL('/', request.url))
      }
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
