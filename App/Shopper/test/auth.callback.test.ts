import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

import { GET } from '../src/app/api/auth/callback/google/route'

function reqWithCookies(url: string, cookies: Record<string, string>): NextRequest {
  const cookieHeader = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ')
  return new NextRequest(new URL(url), {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
  })
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('GET /api/auth/callback/google', () => {
  it('redirects to /login when state cookie is missing', async () => {
    const req = reqWithCookies(
      'http://localhost:3000/api/auth/callback/google?code=c&state=s',
      {},
    )
    const res = await GET(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('http://localhost:3000/login')
  })

  it('redirects to /login when state does not match cookie', async () => {
    const req = reqWithCookies(
      'http://localhost:3000/api/auth/callback/google?code=c&state=mismatch',
      { oauth_state: 'expected' },
    )
    const res = await GET(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('http://localhost:3000/login')
  })

  it('redirects to /login when AuthService rejects the code', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('nope', { status: 401 }))
    const req = reqWithCookies(
      'http://localhost:3000/api/auth/callback/google?code=bad&state=s',
      { oauth_state: 's' },
    )
    const res = await GET(req)
    expect(res.headers.get('location')).toBe('http://localhost:3000/login')
    expect(res.cookies.get('session')).toBeUndefined()
  })

  it('redirects to returnTo and sets session cookie on success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ name: 'Sally Shopper', accessToken: 'jwe-from-auth-service' }),
        { status: 200 },
      ),
    )
    const req = reqWithCookies(
      'http://localhost:3000/api/auth/callback/google?code=good&state=s',
      { oauth_state: 's', oauth_return_to: '/wishlist' },
    )
    const res = await GET(req)

    expect(res.headers.get('location')).toBe('http://localhost:3000/wishlist')
    expect(res.cookies.get('session')?.value).toBe('jwe-from-auth-service')
  })
})
