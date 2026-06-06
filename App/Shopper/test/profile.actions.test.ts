import { it, expect, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from './mswServer'
import { getProfilePicture } from '../src/profile/actions'

it('falls back to localhost:3010 when AUTH_SERVICE_URL is not set', async () => {
  const saved = process.env.AUTH_SERVICE_URL
  try {
    delete process.env.AUTH_SERVICE_URL
    vi.resetModules()
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({}), { status: 200 })
    )
    const { getProfilePicture: fresh } = await import('../src/profile/actions')
    await fresh()
    expect(fetchSpy.mock.calls[0][0]).toContain('http://localhost:3010')
    fetchSpy.mockRestore()
  } finally {
    process.env.AUTH_SERVICE_URL = saved
    vi.resetModules()
  }
})

it('authHeaders sends no Authorization header when session cookie is absent', async () => {
  const { cookies } = await import('next/headers')
  vi.mocked(cookies).mockResolvedValueOnce({
    get: vi.fn().mockReturnValue(undefined),
    set: vi.fn(),
    delete: vi.fn(),
  } as any)
  const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
    new Response(JSON.stringify({}), { status: 200 })
  )
  await getProfilePicture()
  const headers = fetchSpy.mock.calls[0][1]?.headers as Record<string, string> | undefined
  expect(headers?.Authorization).toBeUndefined()
  fetchSpy.mockRestore()
})

it('getProfilePicture returns undefined when response is not ok', async () => {
  server.use(
    http.get('http://localhost:3010/api/v0/profile/picture', () =>
      new HttpResponse(null, { status: 500 }), { once: true }
    )
  )
  const result = await getProfilePicture()
  expect(result).toBeUndefined()
})
