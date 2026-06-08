import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest'
import request from 'supertest'

import app from '../src/app'
import { pool } from '../src/db'
import { mockGoogle } from './googleMock'

const REDIRECT_URI = 'http://localhost:3000/sell/api/auth/callback/google'

beforeEach(() => {
  vi.restoreAllMocks()
})

afterEach(async () => {
  await pool.query(`DELETE FROM seller WHERE data->>'google_sub' LIKE 'seller-test-%'`)
})

afterAll(async () => {
  await pool.end()
})

describe('POST /api/v0/auth/google/exchange/seller', () => {
  it('inserts a new seller for a never-seen google_sub', async () => {
    mockGoogle({ sub: 'seller-test-new', email: 'new@kg.test', name: 'New Seller' })
    const res = await request(app)
      .post('/api/v0/auth/google/exchange/seller')
      .send({ code: 'the-code', redirectUri: REDIRECT_URI })
      .expect(200)
    expect(res.body.name).toBe('New Seller')
    expect(typeof res.body.accessToken).toBe('string')

    const rows = await pool.query(
      `SELECT data FROM seller WHERE data->>'google_sub' = 'seller-test-new'`,
    )
    expect(rows.rowCount).toBe(1)
    expect(rows.rows[0].data.email).toBe('new@kg.test')
  })

  it('updates email/name on returning seller', async () => {
    mockGoogle({ sub: 'seller-test-twice', email: 'twice@kg.test', name: 'Twice One' })
    await request(app)
      .post('/api/v0/auth/google/exchange/seller')
      .send({ code: 'c1', redirectUri: REDIRECT_URI })

    mockGoogle({ sub: 'seller-test-twice', email: 'twice@kg.test', name: 'Twice Renamed' })
    const second = await request(app)
      .post('/api/v0/auth/google/exchange/seller')
      .send({ code: 'c2', redirectUri: REDIRECT_URI })
      .expect(200)
    expect(second.body.name).toBe('Twice Renamed')

    const rows = await pool.query(
      `SELECT data FROM seller WHERE data->>'google_sub' = 'seller-test-twice'`,
    )
    expect(rows.rowCount).toBe(1)
    expect(rows.rows[0].data.name).toBe('Twice Renamed')
  })

  it('returns 403 when the seller is suspended', async () => {
    // Seed a suspended seller manually with the matching google_sub.
    await pool.query(
      `INSERT INTO seller(data) VALUES ($1::jsonb)`,
      [JSON.stringify({
        google_sub: 'seller-test-suspended',
        email: 'sus@kg.test', name: 'Sus', suspended: true,
      })],
    )
    mockGoogle({ sub: 'seller-test-suspended', email: 'sus@kg.test', name: 'Sus' })
    await request(app)
      .post('/api/v0/auth/google/exchange/seller')
      .send({ code: 'c', redirectUri: REDIRECT_URI })
      .expect(403)
  })

  it('returns 401 when Google rejects the code', async () => {
    mockGoogle({ sub: 'unused', email: 'unused', name: 'unused' }, false)
    await request(app)
      .post('/api/v0/auth/google/exchange/seller')
      .send({ code: 'bad', redirectUri: REDIRECT_URI })
      .expect(401)
  })
})
