import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import { JweAuthService } from '../src/auth/jwe'

describe('JweAuthService.lookup', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('rejects when Authorization header is missing', async () => {
    await expect(new JweAuthService().lookup(undefined)).rejects.toThrow('Unauthorized')
  })

  it('rejects when token is missing from the header', async () => {
    await expect(new JweAuthService().lookup('Bearer')).rejects.toThrow('Unauthorized')
  })

  it('rejects when AuthService returns non-2xx', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(new Response('', { status: 401 }))
    await expect(new JweAuthService().lookup('Bearer bad-token')).rejects.toThrow('Unauthorized')
  })

  it('returns AuthSeller with the session user id on success', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({ id: 'seller-uuid-1', email: 'e@x', name: 'n', role: 'seller' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )
    const result = await new JweAuthService().lookup('Bearer my-jwe')
    expect(result).toEqual({ id: 'seller-uuid-1' })
  })

  it('rejects a token whose role is not seller', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({ id: 'shopper-uuid', email: 'e', name: 'n', role: 'shopper' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )
    await expect(new JweAuthService().lookup('Bearer shopper-jwe'))
      .rejects.toThrow('Unauthorized')
  })

  it('rejects a token with no role claim (legacy)', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'legacy', email: 'e', name: 'n' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    await expect(new JweAuthService().lookup('Bearer legacy-jwe'))
      .rejects.toThrow('Unauthorized')
  })

  it('forwards the bearer token to AuthService /check', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'x', role: 'seller' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    await new JweAuthService().lookup('Bearer my-jwe')
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/api/v0/check')
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer my-jwe')
  })
})
