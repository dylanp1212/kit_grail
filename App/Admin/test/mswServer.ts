import {setupServer} from 'msw/node'
import {http, HttpResponse} from 'msw'

const CHECKOUT_MS = 'http://localhost:3014/api/v0/checkout'
const AUTH_MS = 'http://localhost:3010/api/v0'

export const seedOrders = [
  {
    id: 'order-1',
    status: 'paid',
    paid_at: '2026-06-01T12:00:00Z',
    shopper_id: 'shopper-1',
    shopper_name: 'Alice Shopper',
    shopper_email: 'alice@example.com',
    items: [
      {
        id: 'item-1',
        kit_listing: 'listing-1',
        title: '2019 USA Women World Cup Jersey',
        price: 150,
        seller_id: 'seller-1',
        seller_name: 'Bob Seller',
        seller_email: 'bob@example.com',
      },
    ],
  },
]

export const seedOrdersPerDay = [
  {day: '2026-06-01', count: 3, total: 450},
  {day: '2026-06-02', count: 1, total: 150},
  {day: '2026-06-03', count: 2, total: 300},
  {day: String(new Date()), count: 2, total: 300},
  {day: '2025-06-03', count: 2, total: 500},
]

export const seedSellers = [
  {id: 'seller-1', name: 'Bob Seller', email: 'bob@example.com', suspended: false},
  {id: 'seller-2', name: 'Carol Seller', email: 'carol@example.com', suspended: true},
]

export const server = setupServer(
  http.get(`${AUTH_MS}/sellers`, () => {
    return HttpResponse.json(seedSellers)
  }),

  http.put(`${AUTH_MS}/sellers/:id/suspended`, () => {
    return new HttpResponse(null, {status: 200})
  }),

  http.get(`${CHECKOUT_MS}/orders/all`, () => {
    return HttpResponse.json(seedOrders)
  }),

  http.get(`${CHECKOUT_MS}/orders/by-seller`, () => {
    return HttpResponse.json(seedOrders)
  }),

  http.get(`${CHECKOUT_MS}/orders/per-day`, () => {
    return HttpResponse.json(seedOrdersPerDay)
  }),

  http.post(`${AUTH_MS}/auth/admin/login`, async ({request}) => {
    const body = await request.json() as {email: string, password: string}
    if (body.email === 'admin@example.com' && body.password === 'password') {
      return HttpResponse.json({name: 'Admin', accessToken: 'test-token'})
    }
    return new HttpResponse(null, {status: 401})
  }),

  http.get(`${AUTH_MS}/check`, () => {
    return HttpResponse.json({
      id: 'admin-1',
      email: 'admin@example.com',
      name: 'Admin',
      role: 'administrator',
    })
  }),
)
