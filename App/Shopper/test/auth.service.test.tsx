import { describe, it, expect, vi, beforeEach } from 'vitest'

import { AuthService } from '../src/auth/service'

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('AuthService.exchangeGoogle', () => {
  it('POSTs to AuthService and returns the Authenticated body', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ name: 'Sally Shopper', accessToken: 'jwe-token' }),
        { status: 200 },
      ),
    )

    const result = await new AuthService().exchangeGoogle(
      'the-code',
      'http://localhost:3000/api/auth/callback/google',
    )

    expect(result).toEqual({ name: 'Sally Shopper', accessToken: 'jwe-token' })
    expect(fetchSpy).toHaveBeenCalledOnce()
    const [url, init] = fetchSpy.mock.calls[0]
    expect(url).toBe('http://localhost:3010/api/v0/auth/google/exchange')
    expect(init?.method).toBe('POST')
    expect(JSON.parse(init?.body as string)).toEqual({
      code: 'the-code',
      redirectUri: 'http://localhost:3000/api/auth/callback/google',
    })
  })

  it('returns undefined when AuthService responds with non-2xx', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('nope', { status: 401 }))
    const result = await new AuthService().exchangeGoogle('bad-code', 'http://x')
    expect(result).toBeUndefined()
  })
})

describe('AuthService.check', () => {
  it('GETs /check with Bearer token and returns the SessionUser', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 'e86405c1-545b-4bef-912c-a9b01ee6d18f',
          email: 'sally@gmail.com',
          name: 'Sally Shopper',
        }),
        { status: 200 },
      ),
    )

    const result = await new AuthService().check('jwe-token')

    expect(result).toEqual({
      id: 'e86405c1-545b-4bef-912c-a9b01ee6d18f',
      email: 'sally@gmail.com',
      name: 'Sally Shopper',
    })
    const [url, init] = fetchSpy.mock.calls[0]
    expect(url).toBe('http://localhost:3010/api/v0/check')
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer jwe-token')
  })

  it('returns undefined when the token is rejected', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('nope', { status: 401 }))
    const result = await new AuthService().check('bad-token')
    expect(result).toBeUndefined()
  })
})
