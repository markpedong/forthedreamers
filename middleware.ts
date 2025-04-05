import { getToken } from 'next-auth/jwt'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { AUTH_SECRET, PROFILE_MENUS } from './constants'

export const middleware = async (request: NextRequest, event: NextFetchEvent) => {
  const token = await getToken({ req: request, secret: AUTH_SECRET })
  const { pathname, searchParams } = request.nextUrl

  const protectedRoutes = ['/profile', '/checkout', '/cart']
  const userRestrictedRoutes = ['/seller/dashboard']

  if (token) {
    const orderID = request.cookies.get('orderID')?.value

    if (pathname === "/order-success") {
      if (!orderID) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    if (pathname === '/checkout') {
      if (!!orderID) {
        return NextResponse.redirect(new URL('/order-success', request.url))
      }

      const cartItems = await fetch(`${process.env.NEXTAUTH_URL}/api/cart/${token.id}`)

      if ((await cartItems.json())?.data.length === 0) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (pathname === '/profile' && (!searchParams.has('tab') || !PROFILE_MENUS.includes(`${searchParams.get('tab')}`))) {
      const url = request.nextUrl.clone()
      url.searchParams.set('tab', 'personal-information')
      return NextResponse.redirect(url)
    }

  } else {
    if (protectedRoutes.includes(pathname) || userRestrictedRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
}
