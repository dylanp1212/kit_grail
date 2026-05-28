import { it, expect, vi } from 'vitest'
import { getShopperId } from '../src/shoppingcart/actions'
import { sallyid } from '../vitest.setup'

vi.unmock('../src/shoppingcart/service')

it('returns user id when authenticated', async () => {
  const id = await getShopperId()
  expect(id).toBe(sallyid)
})

it('returns guest cookie id when not authenticated and cookie exists', async () => {
  // overide default mocks to return undefined user and a guest cookie
  const { getSessionUser } = await import('../src/auth/actions')
  const { cookies } = await import('next/headers')
  vi.mocked(getSessionUser).mockResolvedValueOnce(undefined)
  vi.mocked(cookies).mockResolvedValueOnce({
    get: vi.fn().mockReturnValue({ value: 'guest-abc-123' }),
    set: vi.fn(),
  } as any)
  const id = await getShopperId()
  expect(id).toBe('guest-abc-123')
})

it('creates new guest UUID when not authenticated and no cookie exists', async () => {
  const { getSessionUser } = await import('../src/auth/actions')
  vi.mocked(getSessionUser).mockResolvedValueOnce(undefined)
  const id = await getShopperId()
  expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
})
