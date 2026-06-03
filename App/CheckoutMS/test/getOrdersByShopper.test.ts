import {beforeEach, expect, it} from 'vitest'
import request from 'supertest'
import app from '../src/app'
import {CheckoutService} from '../src/checkout/service'
import {pool} from '../src/db'
import {SHOPPER_ID} from '../vitest.setup'

const OTHER_SHOPPER = '3436e28c-8d0f-42e1-a733-eb42358ca451'
const LISTING_A = '5e25b4f0-2ef4-4ec0-8ae0-e97ca701eb74'
const LISTING_B = '8942027f-523a-4983-843b-0f12370aa1ea'

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

it('returns orders for the given shopper', async () => {
  await createOrder('cs_shopper_1', SHOPPER_ID, [
    {id: LISTING_A, title: 'Messi Jersey', price: 300},
  ])
  const res = await request(app).get('/api/v0/checkout/orders/by-shopper').query({shopperid: SHOPPER_ID})
  expect(res.status).toBe(200)
  expect(res.body).toHaveLength(1)
  expect(res.body[0].status).toBe('paid')
})

it('returns items within the order', async () => {
  await createOrder('cs_shopper_2', SHOPPER_ID, [
    {id: LISTING_A, title: 'Messi Jersey', price: 300},
    {id: LISTING_B, title: 'Random Jersey', price: 20},
  ])
  const res = await request(app).get('/api/v0/checkout/orders/by-shopper').query({shopperid: SHOPPER_ID})
  expect(res.body[0].items).toHaveLength(2)
  expect(res.body[0].items.map((i: {title: string}) => i.title)).toContain('Messi Jersey')
  expect(res.body[0].items.map((i: {title: string}) => i.title)).toContain('Random Jersey')
})

it('returns orders sorted by paid_at DESC', async () => {
  await createOrder('cs_shopper_3', SHOPPER_ID, [{id: LISTING_A, title: 'Old Jersey', price: 100}])
  await createOrder('cs_shopper_4', SHOPPER_ID, [{id: LISTING_B, title: 'New Jersey', price: 200}])
  const res = await request(app).get('/api/v0/checkout/orders/by-shopper').query({shopperid: SHOPPER_ID})
  expect(res.body[0].items[0].title).toBe('New Jersey')
  expect(res.body[1].items[0].title).toBe('Old Jersey')
})

it('does not return another shoppers orders', async () => {
  await createOrder('cs_shopper_5', OTHER_SHOPPER, [
    {id: LISTING_A, title: 'Messi Jersey', price: 300},
  ])
  const res = await request(app).get('/api/v0/checkout/orders/by-shopper').query({shopperid: SHOPPER_ID})
  expect(res.body).toHaveLength(0)
})

it('returns 400 when shopperid is missing', async () => {
  const res = await request(app).get('/api/v0/checkout/orders/by-shopper').query({shopperid: ''})
  expect(res.status).toBe(400)
})
