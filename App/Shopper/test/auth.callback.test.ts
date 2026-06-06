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
  it('redirects to /login when code or state query param is missing', async () => {
    const req = reqWithCookies(
      'http://localhost:3000/api/auth/callback/google?state=s',
      {},
    )
    const res = await GET(req)
    expect(res.headers.get('location')).toBe('http://localhost:3000/login')
  })

  it('uses GOOGLE_REDIRECT_URI origin when env var is set', async () => {
    process.env.GOOGLE_REDIRECT_URI = 'https://kitgrail.com/api/auth/callback/google'
    try {
      const req = reqWithCookies(
        'http://localhost:3000/api/auth/callback/google?state=s',
        {},
      )
      const res = await GET(req)
      expect(res.headers.get('location')).toBe('https://kitgrail.com/login')
    } finally {
      delete process.env.GOOGLE_REDIRECT_URI
    }
  })

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

  describe('seller flow', () => {
    it('redirects to /seller-suspended when seller is suspended', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('forbidden', { status: 403 }))
      const req = reqWithCookies(
        'http://localhost:3000/api/auth/callback/google?code=c&state=s',
        { seller_oauth_state: 's' },
      )
      const res = await GET(req)
      expect(res.headers.get('location')).toBe('http://localhost:3000/seller-suspended')
    })

    it('redirects to /login when seller exchange fails', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('nope', { status: 500 }))
      const req = reqWithCookies(
        'http://localhost:3000/api/auth/callback/google?code=c&state=s',
        { seller_oauth_state: 's' },
      )
      const res = await GET(req)
      expect(res.headers.get('location')).toBe('http://localhost:3000/login')
    })

    it('redirects to /sell/ and sets seller_session cookie on success', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ name: 'Sally Seller', accessToken: 'seller-token' }), { status: 200 }),
      )
      const req = reqWithCookies(
        'http://localhost:3000/api/auth/callback/google?code=c&state=s',
        { seller_oauth_state: 's' },
      )
      const res = await GET(req)
      expect(res.headers.get('location')).toBe('http://localhost:3000/sell/')
      expect(res.cookies.get('seller_session')?.value).toBe('seller-token')
    })
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

  it('merges guest cart and deletes guest_id cookie when user is identified', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ name: 'Sally', accessToken: 'token' }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ id: 'user-id', name: 'Sally', email: 'sally@example.com', role: 'shopper' }),
          { status: 200 },
        ),
      )
    const req = reqWithCookies(
      'http://localhost:3000/api/auth/callback/google?code=c&state=s',
      { oauth_state: 's', guest_id: 'guest-uuid' },
    )
    const res = await GET(req)
    expect(res.cookies.get('guest_id')?.value).toBe('')
  })

  it('skips cart merge and leaves guest_id when check returns no user', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ name: 'Sally', accessToken: 'token' }), { status: 200 }),
      )
      .mockResolvedValueOnce(new Response('unauthorized', { status: 401 }))
    const req = reqWithCookies(
      'http://localhost:3000/api/auth/callback/google?code=c&state=s',
      { oauth_state: 's', guest_id: 'guest-uuid' },
    )
    const res = await GET(req)
    expect(res.cookies.get('guest_id')).toBeUndefined()
  })
})
