import { describe, it, expect } from 'vitest'
import request from 'supertest'

import app from '../src/app'

describe('GET /api/v0/health', () => {
  it('returns 200 and ok status', async () => {
    const res = await request(app).get('/api/v0/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})
