import { describe, it, expect } from 'vitest'
import request from 'supertest'

import app from '../src/app'
import { AuthService } from '../src/auth/service'
import { SessionUser } from '../src/auth'

const samplePayload: SessionUser = {
  id: 'e86405c1-545b-4bef-912c-a9b01ee6d18f',
  email: 'sally@gmail.com',
  name: 'Sally Shopper',
  role: 'shopper',
}

describe('GET /api/v0/check', () => {
  it('returns 401 without an Authorization header', async () => {
    const res = await request(app).get('/api/v0/check')
    expect(res.status).toBe(401)
  })

  it('returns 401 with an invalid token', async () => {
    const res = await request(app)
      .get('/api/v0/check')
      .set('Authorization', 'Bearer not-a-real-token')
    expect(res.status).toBe(401)
  })

  it('returns 200 and the session user with a valid token', async () => {
    const token = await new AuthService().issue(samplePayload)
    const res = await request(app)
      .get('/api/v0/check')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual(samplePayload)
  })
})
