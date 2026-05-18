import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import supertest from 'supertest'

import { server } from './setup'
import { pool } from '../src/db'
import { createTestSeller, deleteTestSeller, TestSeller } from './sellerFixture'
import { mockSession, mockSessionForbidden } from './sessionMock'

let seller: TestSeller

beforeEach(async () => {
  seller = await createTestSeller('key-create@kg.test', 'Key Creator')
  mockSession(seller.id)
})

afterEach(async () => {
  vi.restoreAllMocks()
  await deleteTestSeller(seller.id)
})

describe('POST /api/v0/seller/keys', () => {
  it('returns 401 without an Authorization header', async () => {
    vi.restoreAllMocks()
    await supertest(server)
      .post('/api/v0/seller/keys')
      .send({ label: 'Production' })
      .expect(401)
  })

  it('returns 401 when AuthService rejects the token', async () => {
    mockSessionForbidden()
    await supertest(server)
      .post('/api/v0/seller/keys')
      .set('Authorization', 'Bearer bad-jwe')
      .send({ label: 'Production' })
      .expect(401)
  })

  it('returns 201 with plaintext and metadata on success', async () => {
    const res = await supertest(server)
      .post('/api/v0/seller/keys')
      .set('Authorization', 'Bearer jwe-token')
      .send({ label: 'Production' })
      .expect(201)
    expect(res.body.plaintext).toMatch(/^kg_/)
    expect(res.body.prefix).toBe(res.body.plaintext.slice(0, 12))
    expect(res.body.label).toBe('Production')
    expect(typeof res.body.created_at).toBe('string')
    expect(res.body.id).toBeTruthy()
  })

  it('never returns the hash in the response', async () => {
    const res = await supertest(server)
      .post('/api/v0/seller/keys')
      .set('Authorization', 'Bearer jwe-token')
      .send({ label: 'Test' })
      .expect(201)
    expect(res.body.hash).toBeUndefined()
  })

  it('persists the key tied to the authenticated seller', async () => {
    const res = await supertest(server)
      .post('/api/v0/seller/keys')
      .set('Authorization', 'Bearer jwe-token')
      .send({ label: 'Persisted' })
      .expect(201)
    const row = await pool.query<{ seller: string }>(
      `SELECT seller FROM api_key WHERE id = $1`,
      [res.body.id],
    )
    expect(row.rows[0].seller).toBe(seller.id)
  })

  it('the issued key authenticates against /seller/listings', async () => {
    const created = await supertest(server)
      .post('/api/v0/seller/keys')
      .set('Authorization', 'Bearer jwe-token')
      .send({ label: 'Roundtrip' })
      .expect(201)
    vi.restoreAllMocks()
    await supertest(server)
      .get('/api/v0/seller/listings')
      .set('Authorization', `Bearer ${created.body.plaintext}`)
      .expect(200)
  })
})
