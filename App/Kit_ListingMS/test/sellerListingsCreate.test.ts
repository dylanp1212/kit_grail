import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import supertest from 'supertest'

import { server } from './setup'
import { createTestSeller, deleteTestSeller, TestSeller } from './sellerFixture'

const testListing = {
  title: 'Seller-Scoped Test Jersey',
  description: 'Created via the API-key endpoint',
  size: 'large',
  colors: ['red', 'white'],
  price: 99,
}

let seller: TestSeller

beforeEach(async () => {
  seller = await createTestSeller('partner@kg.test', 'Partner Co')
})

afterEach(async () => {
  await deleteTestSeller(seller.id)
})

describe('POST /api/v0/seller/listings', () => {
  it('returns 401 without an Authorization header', async () => {
    await supertest(server)
      .post('/api/v0/seller/listings')
      .send(testListing)
      .expect(401)
  })

  it('returns 401 with an invalid key', async () => {
    await supertest(server)
      .post('/api/v0/seller/listings')
      .set('Authorization', 'Bearer kg_not_a_real_key_xxxxxxxxxxxxxxxxxx')
      .send(testListing)
      .expect(401)
  })

  it('returns 201 and creates a listing scoped to the key holder', async () => {
    const res = await supertest(server)
      .post('/api/v0/seller/listings')
      .set('Authorization', `Bearer ${seller.key}`)
      .send(testListing)
      .expect(201)

    expect(res.body.title).toBe('Seller-Scoped Test Jersey')
    expect(res.body.seller).toBe(seller.id)
    expect(res.body.id).toBeTruthy()
  })
})
