import { it, expect, beforeEach, afterAll } from 'vitest'
import request from 'supertest'

import app from '../src/app'
import { pool } from '../src/db'
import { AuthService } from '../src/auth/service'
import { SessionUser } from '../src/auth'

const SHOPPER_ID = '11111111-1111-1111-1111-111111111111'
const SELLER_ID = '22222222-2222-2222-2222-222222222222'
const GOOGLE_SUB = 'profile-test-sub'

const shopperUser: SessionUser = { id: SHOPPER_ID, email: 'p@kg.test', name: 'Tester', role: 'shopper' }
const sellerUser: SessionUser = { id: SELLER_ID, email: 'p@kg.test', name: 'Tester', role: 'seller' }

beforeEach(async () => {
  await pool.query(`DELETE FROM shopper WHERE id = $1`, [SHOPPER_ID])
  await pool.query(`DELETE FROM seller WHERE id = $1`, [SELLER_ID])
  await pool.query(`INSERT INTO shopper(id, data) VALUES ($1, $2::jsonb)`,
    [SHOPPER_ID, JSON.stringify({ google_sub: GOOGLE_SUB })])
  await pool.query(`INSERT INTO seller(id, data) VALUES ($1, $2::jsonb)`,
    [SELLER_ID, JSON.stringify({ google_sub: GOOGLE_SUB })])
})

afterAll(async () => {
  await pool.end()
})

it('returns 401 without an Authorization header', async () => {
  const res = await request(app).get('/api/v0/profile/picture')
  expect(res.status).toBe(401)
})

it('PUT as shopper syncs picture so seller GET returns the same value', async () => {
  const shopperToken = await new AuthService().issue(shopperUser)
  await request(app).put('/api/v0/profile/picture')
    .set('Authorization', `Bearer ${shopperToken}`)
    .send({ url: 'https://img/p.png' })
    .expect(200)

  const shopperGet = await request(app).get('/api/v0/profile/picture')
    .set('Authorization', `Bearer ${shopperToken}`)
  expect(shopperGet.body.picture).toBe('https://img/p.png')

  const sellerToken = await new AuthService().issue(sellerUser)
  const sellerGet = await request(app).get('/api/v0/profile/picture')
    .set('Authorization', `Bearer ${sellerToken}`)
  expect(sellerGet.body.picture).toBe('https://img/p.png')
})
