import {test, describe, expect} from 'vitest'
import supertest from 'supertest'
import {http, HttpResponse} from 'msw'

import {server} from './setup'
import {mswServer} from './mswServer'

describe('Orders', () => {
  test('can get orders for seller', async () => {
    await supertest(server)
      .get('/api/v0/my-orders')
      .expect(200)
  })

  test('returns empty array when seller has no listings', async () => {
    mswServer.use(
      http.get('http://localhost:3011/api/v0/kit-listing', () =>
        HttpResponse.json([]),
      ),
    )
    const res = await supertest(server)
      .get('/api/v0/my-orders')
      .expect(200)
    expect(res.body).toEqual([])
  })

  test('failed to fetch listings returns error', async () => {
    mswServer.use(
      http.get('http://localhost:3011/api/v0/kit-listing', () =>
        new HttpResponse(null, {status: 500}),
      ),
    )
    await supertest(server)
      .get('/api/v0/my-orders')
      .expect(500)
  })

  test('failed to fetch orders returns error', async () => {
    mswServer.use(
      http.get('http://localhost:3011/api/v0/kit-listing', () =>
        HttpResponse.json([{id: 'listing1'}]),
      ),
      http.get('http://localhost:3014/api/v0/checkout/orders/by-listing', () =>
        new HttpResponse(null, {status: 500}),
      ),
    )
    await supertest(server)
      .get('/api/v0/my-orders')
      .expect(500)
  })

  test('client-supplied sellerID query is ignored (uses session id)', async () => {
    let receivedSellerId: string | null = null
    mswServer.use(
      http.get('http://localhost:3011/api/v0/kit-listing', ({request}) => {
        receivedSellerId = new URL(request.url).searchParams.get('sellerId')
        return HttpResponse.json([])
      }),
    )
    await supertest(server)
      .get('/api/v0/my-orders?sellerID=evil-other-seller-id')
      .expect(200)
    expect(receivedSellerId).toBe('test-seller-id')
  })
})
