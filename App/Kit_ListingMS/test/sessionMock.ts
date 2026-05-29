import { vi } from 'vitest'

export function mockSession(sellerId: string, role: 'shopper' | 'seller' = 'seller'): void {
  vi.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.resolve(
      new Response(
        JSON.stringify({ id: sellerId, email: 'mock@kg.test', name: 'mock', role }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    ),
  )
}

export function mockSessionForbidden(): void {
  vi.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.resolve(new Response('', { status: 401 })),
  )
}
