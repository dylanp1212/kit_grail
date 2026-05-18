import { describe, it, beforeEach, afterEach } from 'vitest'
import supertest from 'supertest'

import { server } from './setup'
import { pool } from '../src/db'
import { createTestSeller, deleteTestSeller, TestSeller } from './sellerFixture'

let seller: TestSeller

beforeEach(async () => {
  seller = await createTestSeller('revoked@kg.test', 'Revoked Partner')
})

afterEach(async () => {
  await deleteTestSeller(seller.id)
})

describe('ApiKeyService.lookup revoked-key handling', () => {
  it('accepts a non-revoked key', async () => {
    await supertest(server)
      .get('/api/v0/seller/listings')
      .set('Authorization', `Bearer ${seller.key}`)
      .expect(200)
  })

  it('rejects a revoked key with 401', async () => {
    await pool.query(
      `UPDATE api_key
         SET data = data || $1::jsonb
       WHERE seller = $2`,
      [JSON.stringify({ revoked_at: new Date().toISOString() }), seller.id],
    )
    await supertest(server)
      .get('/api/v0/seller/listings')
      .set('Authorization', `Bearer ${seller.key}`)
      .expect(401)
  })
})
