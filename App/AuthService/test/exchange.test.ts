import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest'
import request from 'supertest'

import app from '../src/app'
import { pool } from '../src/db'
import { mockGoogle } from './googleMock'

const REDIRECT_URI = 'http://localhost:3000/api/auth/callback/google'

beforeEach(() => {
  vi.restoreAllMocks()
})

afterEach(async () => {
  await pool.query(`DELETE FROM shopper WHERE data->>'google_sub' LIKE 'a4-%'`)
})

afterAll(async () => {
  await pool.end()
})

describe('POST /api/v0/auth/google/exchange', () => {
  it('inserts a new shopper for a never-seen google_sub', async () => {
    mockGoogle({ sub: 'a4-new-1', email: 'a4new1@kg.test', name: 'A4 New One' })

    const res = await request(app)
      .post('/api/v0/auth/google/exchange')
      .send({ code: 'the-code', redirectUri: REDIRECT_URI })

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('A4 New One')
    expect(typeof res.body.accessToken).toBe('string')
    expect(res.body.accessToken.length).toBeGreaterThan(0)

    const rows = await pool.query(
      `SELECT id, data FROM shopper WHERE data->>'google_sub' = 'a4-new-1'`,
    )
    expect(rows.rowCount).toBe(1)
    expect(rows.rows[0].data.email).toBe('a4new1@kg.test')
  })

  it('does not create a duplicate when the same google_sub exchanges twice', async () => {
    mockGoogle({ sub: 'a4-twice-1', email: 'a4twice@kg.test', name: 'A4 Twice' })
    await request(app)
      .post('/api/v0/auth/google/exchange')
      .send({ code: 'code-1', redirectUri: REDIRECT_URI })

    mockGoogle({ sub: 'a4-twice-1', email: 'a4twice@kg.test', name: 'A4 Twice Renamed' })
    const second = await request(app)
      .post('/api/v0/auth/google/exchange')
      .send({ code: 'code-2', redirectUri: REDIRECT_URI })

    expect(second.status).toBe(200)
    expect(second.body.name).toBe('A4 Twice Renamed')

    const rows = await pool.query(
      `SELECT id, data FROM shopper WHERE data->>'google_sub' = 'a4-twice-1'`,
    )
    expect(rows.rowCount).toBe(1)
    expect(rows.rows[0].data.name).toBe('A4 Twice Renamed')
  })

  it('returns 401 when Google rejects the code', async () => {
    mockGoogle({ sub: 'unused', email: 'unused', name: 'unused' }, false)

    const res = await request(app)
      .post('/api/v0/auth/google/exchange')
      .send({ code: 'bad-code', redirectUri: REDIRECT_URI })

    expect(res.status).toBe(401)

    const rows = await pool.query(
      `SELECT id FROM shopper WHERE data->>'google_sub' LIKE 'a4-%'`,
    )
    expect(rows.rowCount).toBe(0)
  })
})
