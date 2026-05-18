import { NextRequest, NextResponse } from 'next/server'

import { AuthService } from '../../../../../auth/service'

const SESSION_COOKIE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 30 * 60,
  path: '/',
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')

  const shopperStateCookie = req.cookies.get('oauth_state')?.value
  const sellerStateCookie = req.cookies.get('seller_oauth_state')?.value

  const redirectUri = process.env.GOOGLE_REDIRECT_URI ?? `${req.nextUrl.origin}/api/auth/callback/google`
  const origin = process.env.GOOGLE_REDIRECT_URI
    ? new URL(process.env.GOOGLE_REDIRECT_URI).origin
    : req.nextUrl.origin
  const loginUrl = new URL('/login', origin)

  if (!code || !state) {
    return NextResponse.redirect(loginUrl)
  }

  // Seller flow — detected by seller_oauth_state cookie
  if (sellerStateCookie && state === sellerStateCookie) {
    const authenticated = await new AuthService().exchangeGoogleSeller(code, redirectUri)
    if (!authenticated) return NextResponse.redirect(loginUrl)
    const response = NextResponse.redirect(new URL('/sell/', origin))
    response.cookies.set('seller_session', authenticated.accessToken, SESSION_COOKIE)
    response.cookies.delete('seller_oauth_state')
    return response
  }

  // Shopper flow
  const returnTo = req.cookies.get('oauth_return_to')?.value ?? '/listings'
  if (!shopperStateCookie || state !== shopperStateCookie) {
    return NextResponse.redirect(loginUrl)
  }

  const authenticated = await new AuthService().exchangeGoogle(code, redirectUri)
  if (!authenticated) {
    return NextResponse.redirect(loginUrl)
  }

  const response = NextResponse.redirect(new URL(returnTo, origin))
  response.cookies.set('session', authenticated.accessToken, SESSION_COOKIE)
  response.cookies.delete('oauth_state')
  response.cookies.delete('oauth_return_to')
  return response
}
