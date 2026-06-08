import {beforeEach, expect, it} from 'vitest'
import request from 'supertest'
import app from '../src/app'
import {CheckoutService} from '../src/checkout/service'
import {pool} from '../src/db'

const LISTING_A = '5e25b4f0-2ef4-4ec0-8ae0-e97ca701eb74'
const LISTING_B = '8942027f-523a-4983-843b-0f12370aa1ea'
const LISTING_OTHER_SELLER = '96939086-b537-4032-b547-53d7c467a77d'

const SALLY = 'e86405c1-545b-4bef-912c-a9b01ee6d18f'
const TOMMY = '3436e28c-8d0f-42e1-a733-eb42358ca451'

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

it('returns shopper name and email from the shopper table', async () => {
  await createOrder('cs_listing_1', SALLY, [
    {id: LISTING_A, title: 'Argentina Jersey', price: 300},
  ])
  const res = await request(app).get('/api/v0/checkout/orders/by-listing').query({ids: LISTING_A})
  expect(res.status).toBe(200)
  expect(res.body[0].shopper_name).toBe('Sally Shopper')
  expect(res.body[0].shopper_email).toBe('sally@gmail.com')
})

it('returns orders sorted by paid_at DESC (newest first)', async () => {
  await createOrder('cs_listing_3', SALLY, [{id: LISTING_A, title: 'Old', price: 10}])
  await createOrder('cs_listing_4', TOMMY, [{id: LISTING_A, title: 'New', price: 20}])
  const res = await request(app).get('/api/v0/checkout/orders/by-listing').query({ids: LISTING_A})
  expect(res.body.map((o: {shopper_name: string}) => o.shopper_name)).toEqual(['Tommy Shopper', 'Sally Shopper'])
})

it('returns only items matching the seller\'s listing ids', async () => {
  await createOrder('cs_listing_5', SALLY, [
    {id: LISTING_A, title: 'My Jersey', price: 100},
    {id: LISTING_OTHER_SELLER, title: 'Other Seller Jersey', price: 200},
  ])
  const res = await request(app).get('/api/v0/checkout/orders/by-listing').query({ids: LISTING_A})
  expect(res.body[0].items).toHaveLength(1)
  expect(res.body[0].items[0].title).toBe('My Jersey')
})

it('handles multiple listing ids across multiple orders', async () => {
  await createOrder('cs_listing_6', SALLY, [{id: LISTING_A, title: 'A', price: 10}])
  await createOrder('cs_listing_7', SALLY, [{id: LISTING_B, title: 'B', price: 20}])
  const res = await request(app)
    .get('/api/v0/checkout/orders/by-listing')
    .query({ids: `${LISTING_A},${LISTING_B}`})
  expect(res.body).toHaveLength(2)
})

it('returns 400 when ids is missing', async () => {
  const res = await request(app).get('/api/v0/checkout/orders/by-listing').query({ids: ''})
  expect(res.status).toBe(400)
})
