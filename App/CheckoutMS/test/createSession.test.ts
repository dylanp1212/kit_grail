import { it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app'

const BODY = {
  shopperid: 'shopper-1',
  items: [{ id: 'item-1', title: 'Messi Jersey', price: 99.99 }],
  successUrl: 'https://example.com/success',
  cancelUrl: 'https://example.com/cancel',
}

it('returns 400 when items is empty', async () => {
  const res = await request(app).post('/api/v0/checkout/session').send({ ...BODY, items: [] })
  expect(res.status).toBe(400)
})
