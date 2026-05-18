import { vi } from 'vitest'

export function mockSession(sellerId: string): void {
  vi.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.resolve(
      new Response(JSON.stringify({ id: sellerId, email: 'mock@kg.test', name: 'mock' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  )
}

export function mockSessionForbidden(): void {
  vi.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.resolve(new Response('', { status: 401 })),
  )
}
