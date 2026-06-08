import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest'
import request from 'supertest'

import app from '../src/app'
import { pool } from '../src/db'

const A = '11111111-aaaa-aaaa-aaaa-111111111111'
const B = '22222222-bbbb-bbbb-bbbb-222222222222'

beforeEach(async () => {
  await pool.query(`DELETE FROM seller WHERE id IN ($1, $2)`, [A, B])
  await pool.query(
    `INSERT INTO seller(id, data) VALUES
      ($1, $2::jsonb),
      ($3, $4::jsonb)`,
    [
      A, JSON.stringify({ name: 'Alpha Kits',  email: 'alpha@kg.test' }),
      B, JSON.stringify({ name: 'Bravo Kits',  email: 'bravo@kg.test', suspended: true }),
    ],
  )
})

afterEach(async () => {
  await pool.query(`DELETE FROM seller WHERE id IN ($1, $2)`, [A, B])
})

afterAll(async () => {
  await pool.end()
})

describe('GET /api/v0/sellers', () => {
  it('returns sellers with id/email/name/suspended fields', async () => {
    const res = await request(app).get('/api/v0/sellers').expect(200)
    const ids = (res.body as Array<{ id: string }>).map((s) => s.id)
    expect(ids).toContain(A)
    expect(ids).toContain(B)
    const alpha = (res.body as Array<{ id: string; suspended: boolean }>).find(
      (s) => s.id === A,
    )
    const bravo = (res.body as Array<{ id: string; suspended: boolean }>).find(
      (s) => s.id === B,
    )
    expect(alpha?.suspended).toBe(false)
    expect(bravo?.suspended).toBe(true)
  })
})

describe('PUT /api/v0/sellers/{id}/suspended', () => {
  it('suspends an unsuspended seller', async () => {
    await request(app)
      .put(`/api/v0/sellers/${A}/suspended`)
      .send({ suspended: true })
      .expect(204)
    const res = await pool.query<{ suspended: string | null }>(
      `SELECT data->>'suspended' AS suspended FROM seller WHERE id = $1`,
      [A],
    )
    expect(res.rows[0].suspended).toBe('true')
  })

  it('unsuspends a suspended seller', async () => {
    await request(app)
      .put(`/api/v0/sellers/${B}/suspended`)
      .send({ suspended: false })
      .expect(204)
    const res = await pool.query<{ suspended: string | null }>(
      `SELECT data->>'suspended' AS suspended FROM seller WHERE id = $1`,
      [B],
    )
    expect(res.rows[0].suspended).toBe('false')
  })
})
