import {expect, it} from 'vitest'
import request from 'supertest'
import app from '../src/app'
import {CheckoutService} from '../src/checkout/service'

const LISTING_A = '5e25b4f0-2ef4-4ec0-8ae0-e97ca701eb74'

it('returns 400 when ids is empty', async () => {
  const res = await request(app).post('/api/v0/checkout/restore').send({ids: []})
  expect(res.status).toBe(400)
})

it('increments quantities for the given listing ids', async () => {
  await new CheckoutService().decrementQuantities([LISTING_A])
  await expect(new CheckoutService().assertQuantityAvailable([LISTING_A])).rejects.toThrow()
  await request(app).post('/api/v0/checkout/restore').send({ids: [LISTING_A]}).expect(200)
  await expect(new CheckoutService().assertQuantityAvailable([LISTING_A])).resolves.not.toThrow()
})
