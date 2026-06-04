import {describe, it, expect} from 'vitest'
import {NextRequest} from 'next/server'

import proxy from '../src/proxy'

it('redirects to login when cookie missing', async () => {
  const req = new NextRequest(new URL('http://localhost:3000/'))
  const res = await proxy(req)
  expect(res.status).toBe(307)
  expect(res.headers.get('location')).toBe('http://localhost:3000/login')
})

it('lets request through when cookie present', async () => {
  const req = new NextRequest(new URL('http://localhost:3000/'), {
    headers: {cookie: 'admin_session=test-token'},
  })
  const res = await proxy(req)
  expect(res.status).toBe(200)
  expect(res.headers.get('location')).toBeNull()
})
