import { describe, it, expect, vi, beforeEach } from 'vitest'

import { exchangeCodeForTokens, fetchGoogleProfile } from '../src/google'

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('exchangeCodeForTokens', () => {
  it('POSTs to the token endpoint with form-encoded credentials', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ access_token: 'at', id_token: 'it' }), { status: 200 }),
    )

    const tokens = await exchangeCodeForTokens('the-code', 'http://localhost:3000/cb')

    expect(tokens).toEqual({ access_token: 'at', id_token: 'it' })
    expect(fetchSpy).toHaveBeenCalledOnce()
    const [url, init] = fetchSpy.mock.calls[0]
    expect(url).toBe('https://oauth2.googleapis.com/token')
    expect(init?.method).toBe('POST')
    const body = new URLSearchParams(init?.body as string)
    expect(body.get('code')).toBe('the-code')
    expect(body.get('redirect_uri')).toBe('http://localhost:3000/cb')
    expect(body.get('grant_type')).toBe('authorization_code')
    expect(body.get('client_id')).toBe(process.env.GOOGLE_CLIENT_ID)
    expect(body.get('client_secret')).toBe(process.env.GOOGLE_CLIENT_SECRET)
  })

  it('falls back to empty strings when GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are unset', async () => {
    const savedId = process.env.GOOGLE_CLIENT_ID
    const savedSecret = process.env.GOOGLE_CLIENT_SECRET
    delete process.env.GOOGLE_CLIENT_ID
    delete process.env.GOOGLE_CLIENT_SECRET

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ access_token: 'at', id_token: 'it' }), { status: 200 }),
    )

    await exchangeCodeForTokens('code', 'http://localhost/cb')

    const body = new URLSearchParams(fetchSpy.mock.calls[0][1]?.body as string)
    expect(body.get('client_id')).toBe('')
    expect(body.get('client_secret')).toBe('')

    process.env.GOOGLE_CLIENT_ID = savedId
    process.env.GOOGLE_CLIENT_SECRET = savedSecret
  })

  it('throws when Google returns a non-2xx status', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('bad', { status: 400 }),
    )
    await expect(exchangeCodeForTokens('bad-code', 'http://x')).rejects.toThrow(/400/)
  })
})

describe('fetchGoogleProfile', () => {
  it('GETs the userinfo endpoint and returns sub/email/name', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          sub: '1234567890',
          email: 'sally@gmail.com',
          name: 'Sally Shopper',
          picture: 'https://example.com/avatar.png',
          email_verified: true,
        }),
        { status: 200 },
      ),
    )

    const profile = await fetchGoogleProfile('access-token')

    expect(profile).toEqual({
      sub: '1234567890',
      email: 'sally@gmail.com',
      name: 'Sally Shopper',
    })
    const [url, init] = fetchSpy.mock.calls[0]
    expect(url).toBe('https://openidconnect.googleapis.com/v1/userinfo')
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer access-token')
  })

  it('throws when the userinfo call fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('nope', { status: 401 }),
    )
    await expect(fetchGoogleProfile('bad-token')).rejects.toThrow(/401/)
  })
})
