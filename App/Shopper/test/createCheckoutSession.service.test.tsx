import {it, expect, vi} from 'vitest'
import {http, HttpResponse} from 'msw'
import {server} from './mswServer'
import {createCheckoutSession} from '../src/checkout/service'

vi.unmock('../src/checkout/service')

const SESSION_URL = 'http://localhost:3000/api/v0/checkout/session'

it('returns the url from the checkout response', async () => {
  server.use(
    http.post(SESSION_URL, () => HttpResponse.json({url: 'https://checkout.stripe.com/pay/xyz'}))
  )
  const url = await createCheckoutSession('shopper-1', [{title: 'Jersey', price: 50}], '/s', '/c')
  expect(url).toBe('https://checkout.stripe.com/pay/xyz')
})

it('throws when response is not ok', async () => {
  server.use(
    http.post(SESSION_URL, () => HttpResponse.json({error: 'bad'}, {status: 500}))
  )
  await expect(
    createCheckoutSession('shopper-1', [{title: 'Jersey', price: 50}], '/s', '/c')
  ).rejects.toThrow(/Checkout failed/)
})

it('throws when response has no url', async () => {
  server.use(
    http.post(SESSION_URL, () => HttpResponse.json({}))
  )
  await expect(
    createCheckoutSession('shopper-1', [{title: 'Jersey', price: 50}], '/s', '/c')
  ).rejects.toThrow(/Checkout failed/)
})
