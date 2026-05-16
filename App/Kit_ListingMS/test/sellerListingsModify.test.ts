import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import supertest from 'supertest'

import { server } from './setup'
import { pool } from '../src/db'
import { createTestSeller, deleteTestSeller, TestSeller } from './sellerFixture'

let seller: TestSeller
let other: TestSeller
let otherListingId: string

beforeEach(async () => {
  seller = await createTestSeller('mod@kg.test', 'Mod Partner')
  other = await createTestSeller('other-mod@kg.test', 'Other')
  const otherListing = await pool.query<{ id: string }>(
    `INSERT INTO kit_listing(seller, data) VALUES ($1, $2::jsonb) RETURNING id`,
    [other.id, JSON.stringify({ title: 'Not Yours', listed: new Date().toISOString() })],
  )
  otherListingId = otherListing.rows[0].id
})

afterEach(async () => {
  await deleteTestSeller(seller.id)
  await deleteTestSeller(other.id)
})

async function createMine(title = 'My Listing'): Promise<string> {
  const res = await supertest(server)
    .post('/api/v0/seller/listings')
    .set('Authorization', `Bearer ${seller.key}`)
    .send({ title, description: 'd', size: 'large', colors: ['red'], price: 50 })
  return res.body.id as string
}

describe('PATCH /api/v0/seller/listings/:id', () => {
  it('returns 401 without an Authorization header', async () => {
    await supertest(server)
      .patch(`/api/v0/seller/listings/${otherListingId}`)
      .send({ price: 1 })
      .expect(401)
  })

  it('returns 400 on bad UUID', async () => {
    await supertest(server)
      .patch('/api/v0/seller/listings/not-a-uuid')
      .set('Authorization', `Bearer ${seller.key}`)
      .send({ price: 1 })
      .expect(400)
  })

  it('updates an owned listing and returns the new state', async () => {
    const id = await createMine('Before Patch')
    const res = await supertest(server)
      .patch(`/api/v0/seller/listings/${id}`)
      .set('Authorization', `Bearer ${seller.key}`)
      .send({ title: 'After Patch', price: 999 })
      .expect(200)
    expect(res.body.title).toBe('After Patch')
    expect(res.body.price).toBe(999)
  })

  it("returns 404 when targeting another seller's listing", async () => {
    await supertest(server)
      .patch(`/api/v0/seller/listings/${otherListingId}`)
      .set('Authorization', `Bearer ${seller.key}`)
      .send({ price: 1 })
      .expect(404)
  })
})

describe('DELETE /api/v0/seller/listings/:id', () => {
  it('returns 401 without an Authorization header', async () => {
    await supertest(server)
      .delete(`/api/v0/seller/listings/${otherListingId}`)
      .expect(401)
  })

  it('deletes an owned listing', async () => {
    const id = await createMine()
    await supertest(server)
      .delete(`/api/v0/seller/listings/${id}`)
      .set('Authorization', `Bearer ${seller.key}`)
      .expect(204)

    const list = await supertest(server)
      .get('/api/v0/seller/listings')
      .set('Authorization', `Bearer ${seller.key}`)
    expect(list.body.find((l: { id: string }) => l.id === id)).toBeUndefined()
  })

  it("returns 404 when targeting another seller's listing", async () => {
    await supertest(server)
      .delete(`/api/v0/seller/listings/${otherListingId}`)
      .set('Authorization', `Bearer ${seller.key}`)
      .expect(404)

    const stillThere = await pool.query(
      `SELECT 1 FROM kit_listing WHERE id = $1`,
      [otherListingId],
    )
    expect(stillThere.rowCount).toBe(1)
  })
})
