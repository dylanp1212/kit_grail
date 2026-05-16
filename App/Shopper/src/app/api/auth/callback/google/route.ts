import { NextRequest, NextResponse } from 'next/server'

import { AuthService } from '../../../../../auth/service'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')

  const stateCookie = req.cookies.get('oauth_state')?.value
  const returnTo = req.cookies.get('oauth_return_to')?.value ?? '/listings'

  const loginUrl = new URL('/login', req.nextUrl.origin)

  if (!code || !state || !stateCookie || state !== stateCookie) {
    return NextResponse.redirect(loginUrl)
  }

  const redirectUri = process.env.GOOGLE_REDIRECT_URI ?? `${req.nextUrl.origin}/api/auth/callback/google`
  const authenticated = await new AuthService().exchangeGoogle(code, redirectUri)

  if (!authenticated) {
    return NextResponse.redirect(loginUrl)
  }

  const response = NextResponse.redirect(new URL(returnTo, req.nextUrl.origin))
  response.cookies.set('session', authenticated.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 60,
    path: '/',
  })
  response.cookies.delete('oauth_state')
  response.cookies.delete('oauth_return_to')
  return response
}
