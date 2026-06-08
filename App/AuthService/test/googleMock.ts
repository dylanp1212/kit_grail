import { vi } from 'vitest'

// Stubs the two outbound fetches the Google OAuth exchange makes:
// 1. POST to oauth2.googleapis.com/token  → {access_token, id_token}
// 2. GET to userinfo                       → {sub, email, name}
// Pass ok=false to force the first call to return a 4xx instead.
export function mockGoogle(
  profile: { sub: string; email: string; name: string },
  ok = true,
) {
  if (!ok) {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('bad', { status: 400 }),
    )
    return
  }
  vi.spyOn(globalThis, 'fetch')
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ access_token: 'at', id_token: 'it' }), {
        status: 200,
      }),
    )
    .mockResolvedValueOnce(new Response(JSON.stringify(profile), { status: 200 }))
}
