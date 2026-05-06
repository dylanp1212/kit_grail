import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'

import { GET } from '../src/app/api/auth/start/google/route'

describe('GET /api/auth/start/google', () => {
  it('redirects to accounts.google.com with required OAuth params', async () => {
    const req = new NextRequest(new URL('http://localhost:3000/api/auth/start/google'))
    const res = await GET(req)

    expect(res.status).toBe(307)
    const location = res.headers.get('location')
    expect(location).toMatch(/^https:\/\/accounts\.google\.com\/o\/oauth2\/v2\/auth\?/)
    const url = new URL(location!)
    expect(url.searchParams.get('response_type')).toBe('code')
    expect(url.searchParams.get('scope')).toBe('openid email profile')
    expect(url.searchParams.get('redirect_uri')).toBe(
      'http://localhost:3000/api/auth/callback/google',
    )
    expect(url.searchParams.get('client_id')).toBe(process.env.GOOGLE_CLIENT_ID)
    expect(url.searchParams.get('state')).toBeTruthy()
  })

  it('sets oauth_state and oauth_return_to cookies matching the URL', async () => {
    const req = new NextRequest(
      new URL('http://localhost:3000/api/auth/start/google?returnTo=/wishlist'),
    )
    const res = await GET(req)

    const stateCookie = res.cookies.get('oauth_state')?.value
    const returnToCookie = res.cookies.get('oauth_return_to')?.value
    expect(stateCookie).toBeTruthy()
    expect(returnToCookie).toBe('/wishlist')

    const location = res.headers.get('location')
    const urlState = new URL(location!).searchParams.get('state')
    expect(urlState).toBe(stateCookie)
  })
})
