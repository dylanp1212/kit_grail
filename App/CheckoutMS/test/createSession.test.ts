import { it, expect, vi } from 'vitest'
import request from 'supertest'
import Stripe from 'stripe'
import app from '../src/app'
import { pool } from '../src/db'

vi.mock('stripe', () => ({
  default: vi.fn(function () {
    return {
      checkout: {
        sessions: {
          create: vi.fn().mockResolvedValue({url: 'https://checkout.stripe.com/pay/test'}),
        },
      },
    }
  }),
}))

const LISTING_ID = '5e25b4f0-2ef4-4ec0-8ae0-e97ca701eb74'

const BODY = {
  shopperid: 'e86405c1-545b-4bef-912c-a9b01ee6d18f',
  items: [
    { id: LISTING_ID, title: 'Messi Jersey', price: 99.99, image: 'https://example.com/jersey.jpg' },
    { id: LISTING_ID, title: 'Italy Jersey', price: 50 },
  ],
  successUrl: 'https://example.com/success',
  cancelUrl: 'https://example.com/cancel',
}

it('returns 400 when items is empty', async () => {
  const res = await request(app).post('/api/v0/checkout/session').send({ ...BODY, items: [] })
  expect(res.status).toBe(400)
})

it('returns checkout url for valid items', async () => {
  const res = await request(app).post('/api/v0/checkout/session').send(BODY)
  expect(res.status).toBe(200)
  expect(res.body.url).toBe('https://checkout.stripe.com/pay/test')
})

it('returns 500 when listing is unavailable', async () => {
  await pool.query(
    `UPDATE kit_listing SET data = jsonb_set(data, '{quantity}', '0') WHERE id = $1`,
    [LISTING_ID]
  )
  const res = await request(app).post('/api/v0/checkout/session').send(BODY)
  expect(res.status).toBe(500)
})

it('returns 500 when stripe returns no url', async () => {
  vi.mocked(Stripe).mockImplementationOnce(function () {
    // create empty url response to simulate Stripe error
    return {
      checkout: {
        sessions: {create: vi.fn().mockResolvedValue({})},
      },
    } as unknown as Stripe
  })
  const res = await request(app).post('/api/v0/checkout/session').send(BODY)
  expect(res.status).toBe(500)
})
