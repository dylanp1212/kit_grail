import { it, expect, vi } from 'vitest'
import { sallyid } from '../vitest.setup'

vi.unmock('../src/auth/actions')

it('getSessionUser returns user when session cookie exists', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
    new Response(
      JSON.stringify({ id: sallyid, email: 'sally@gmail.com', name: 'Sally Shopper', role: 'shopper' }),
      { status: 200 },
    ),
  )
  const { getSessionUser } = await import('../src/auth/actions')
  const result = await getSessionUser()
  expect(result).toEqual({ id: sallyid, email: 'sally@gmail.com', name: 'Sally Shopper', role: 'shopper' })
})

it('getSessionUser returns undefined when no session cookie', async () => {
  const { cookies } = await import('next/headers')
  vi.mocked(cookies).mockResolvedValueOnce({
    get: vi.fn().mockReturnValue(undefined),
    set: vi.fn(),
    delete: vi.fn(),
  } as any)
  const { getSessionUser } = await import('../src/auth/actions')
  const result = await getSessionUser()
  expect(result).toBeUndefined()
})

it('signOut deletes the session cookie', async () => {
  const { cookies } = await import('next/headers')
  const deleteSpy = vi.fn()
  vi.mocked(cookies).mockResolvedValueOnce({
    get: vi.fn(),
    set: vi.fn(),
    delete: deleteSpy,
  } as any)
  const { signOut } = await import('../src/auth/actions')
  await signOut()
  expect(deleteSpy).toHaveBeenCalledWith('session')
})
