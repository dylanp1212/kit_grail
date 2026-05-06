import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'

import proxy from '../src/proxy'

describe('proxy', () => {
  it('redirects to /login with returnTo when session cookie is missing', async () => {
    const req = new NextRequest(new URL('http://localhost:3000/wishlist'))
    const res = await proxy(req)

    expect(res.status).toBe(307)
    const location = res.headers.get('location')
    expect(location).toBe('http://localhost:3000/login?returnTo=%2Fwishlist')
  })

  it('lets the request through when session cookie is present', async () => {
    const req = new NextRequest(new URL('http://localhost:3000/wishlist'), {
      headers: { cookie: 'session=jwe-value' },
    })
    const res = await proxy(req)

    expect(res.headers.get('location')).toBeNull()
    expect(res.status).not.toBe(307)
  })
})
