import { NextRequest, NextResponse } from 'next/server'

export default async function proxy(req: NextRequest): Promise<NextResponse> {
  const cookie = req.cookies.get('session')?.value
  if (!cookie) {
    const loginUrl = new URL('/login', req.nextUrl.origin)
    loginUrl.searchParams.set('returnTo', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/wishlist/:path*', '/cart/:path*', '/buy/:path*'],
}
