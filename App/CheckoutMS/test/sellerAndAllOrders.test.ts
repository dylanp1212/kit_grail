import {beforeEach, expect, it} from 'vitest'
import request from 'supertest'
import app from '../src/app'
import {CheckoutService} from '../src/checkout/service'
import {pool} from '../src/db'
import {SHOPPER_ID} from '../vitest.setup'

const SELLER_ID = 'cc34e0f8-a81f-45df-8ff0-9f9cdac872b0'   // Stewie, seller of LISTING_A
const LISTING_A = '5e25b4f0-2ef4-4ec0-8ae0-e97ca701eb74'   // Messi jersey, sold by Stewie
const LISTING_B = '4d40647d-6691-4b8f-bec4-b93831e28e17'   // Italy jersey, sold by Bill

const service = new CheckoutService()

async function createOrder(
  sessionId: string,
  shopper: string,
  items: Array<{id: string; title: string; price: number}>,
) {
  await service.createOrder({
    id: sessionId,
    metadata: {shopperid: shopper, items: JSON.stringify(items)},
  })
}

beforeEach(async () => {
  await pool.query('DELETE FROM order_item')
  await pool.query('DELETE FROM orders')
})

it('GET /orders/by-seller returns 400 when sellerid missing', async () => {
  const res = await request(app).get('/api/v0/checkout/orders/by-seller').query({sellerid: ''})
  expect(res.status).toBe(400)
})

it('GET /orders/by-seller returns only that seller\'s items', async () => {
  await createOrder('cs_seller_1', SHOPPER_ID, [
    {id: LISTING_A, title: 'Messi Jersey', price: 300},
    {id: LISTING_B, title: 'Italy Jersey', price: 134},
  ])
  const res = await request(app).get('/api/v0/checkout/orders/by-seller').query({sellerid: SELLER_ID})
  expect(res.status).toBe(200)
  expect(res.body).toHaveLength(1)
  // Stewie only sold LISTING_A, so only that item should be returned
  expect(res.body[0].items.map((i: {title: string}) => i.title)).toEqual(['Messi Jersey'])
  expect(res.body[0].seller_name).toBe('Stewie Seller')
})

it('GET /orders/all returns every order across sellers', async () => {
  await createOrder('cs_all_1', SHOPPER_ID, [{id: LISTING_A, title: 'A', price: 50}])
  await createOrder('cs_all_2', SHOPPER_ID, [{id: LISTING_B, title: 'B', price: 75}])
  const res = await request(app).get('/api/v0/checkout/orders/all')
  expect(res.status).toBe(200)
  expect(res.body).toHaveLength(2)
})

it('GET /orders/per-day returns aggregated counts and totals', async () => {
  await createOrder('cs_day_1', SHOPPER_ID, [{id: LISTING_A, title: 'A', price: 100}])
  await createOrder('cs_day_2', SHOPPER_ID, [{id: LISTING_B, title: 'B', price: 200}])
  const res = await request(app).get('/api/v0/checkout/orders/per-day')
  expect(res.status).toBe(200)
  expect(res.body.length).toBeGreaterThan(0)
  expect(Number(res.body[0].total)).toBeGreaterThan(0)
  expect(Number(res.body[0].count)).toBeGreaterThan(0)
})
