import { getToken } from 'next-auth/jwt'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { AUTH_SECRET } from './constants'
import { getCookie } from './lib/server'

export const middleware = async (request: NextRequest, event: NextFetchEvent) => {
  const token = await getToken({ req: request, secret: AUTH_SECRET })
  const path = request.nextUrl.pathname

  const protectedRoutes = ['/profile', '/checkout', '/cart']
  const userRestrictedRoutes = ['/seller/dashboard']

  if (token) {
    const orderID = request.cookies.get('orderID')?.value

    if (path === "/order-success") {
      if (!orderID) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    if (path === '/checkout') {
      if (!!orderID) {
        return NextResponse.redirect(new URL('/order-success', request.url))
      }

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
