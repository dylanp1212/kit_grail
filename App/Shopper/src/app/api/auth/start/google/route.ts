import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 600,
  path: '/',
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const state = randomUUID()
  const returnTo = req.nextUrl.searchParams.get('returnTo') ?? '/listings'
  const redirectUri = `${req.nextUrl.origin}/api/auth/callback/google`

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? '',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
  })
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

  const response = NextResponse.redirect(googleUrl)
  response.cookies.set('oauth_state', state, COOKIE_OPTIONS)
  response.cookies.set('oauth_return_to', returnTo, COOKIE_OPTIONS)
  return response
}
