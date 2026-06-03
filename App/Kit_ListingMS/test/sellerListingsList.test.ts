import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import supertest from 'supertest'

import { server } from './setup'
import { pool } from '../src/db'
import { createTestSeller, deleteTestSeller, TestSeller } from './sellerFixture'

let seller: TestSeller
let other: TestSeller

beforeEach(async () => {
  seller = await createTestSeller('listpartner@kg.test', 'List Partner')
  other = await createTestSeller('other@kg.test', 'Other Partner')
  await pool.query(
    `INSERT INTO kit_listing(seller, data) VALUES ($1, $2::jsonb)`,
    [other.id, JSON.stringify({ title: 'Other Seller Jersey', listed: new Date().toISOString() })],
  )
})

afterEach(async () => {
  await deleteTestSeller(seller.id)
  await deleteTestSeller(other.id)
})

describe('GET /api/v0/seller/listings', () => {
  it('returns 401 without an Authorization header', async () => {
    await supertest(server).get('/api/v0/seller/listings').expect(401)
  })

  it('returns only listings owned by the authenticated seller', async () => {
    await supertest(server)
      .post('/api/v0/seller/listings')
      .set('Authorization', `Bearer ${seller.key}`)
      .send({ title: 'Mine A', description: 'd', size: 'large', colors: ['red'], price: 10, quantity: 1 })
    await supertest(server)
      .post('/api/v0/seller/listings')
      .set('Authorization', `Bearer ${seller.key}`)
      .send({ title: 'Mine B', description: 'd', size: 'large', colors: ['red'], price: 20, quantity: 1 })

    const res = await supertest(server)
      .get('/api/v0/seller/listings')
      .set('Authorization', `Bearer ${seller.key}`)
      .expect(200)

    expect(res.body).toHaveLength(2)
    expect(res.body.every((l: { seller: string }) => l.seller === seller.id)).toBe(true)
    const titles = res.body.map((l: { title: string }) => l.title)
    expect(titles).toContain('Mine A')
    expect(titles).toContain('Mine B')
    expect(titles).not.toContain('Other Seller Jersey')
  })

  it('filters by search query', async () => {
    await supertest(server)
      .post('/api/v0/seller/listings')
      .set('Authorization', `Bearer ${seller.key}`)
      .send({ title: 'Vintage Argentina', description: 'd', size: 'large', colors: ['blue'], price: 50, quantity: 1 })
    await supertest(server)
      .post('/api/v0/seller/listings')
      .set('Authorization', `Bearer ${seller.key}`)
      .send({ title: 'Modern Brazil', description: 'd', size: 'large', colors: ['yellow'], price: 60, quantity: 1 })

    const res = await supertest(server)
      .get('/api/v0/seller/listings?search=argentina')
      .set('Authorization', `Bearer ${seller.key}`)
      .expect(200)

    const titles = res.body.map((l: { title: string }) => l.title)
    expect(titles).toContain('Vintage Argentina')
    expect(titles).not.toContain('Modern Brazil')
  })
})
