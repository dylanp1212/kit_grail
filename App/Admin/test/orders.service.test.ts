import {it, expect} from 'vitest'
import {http, HttpResponse} from 'msw'
import {OrderService} from '../src/orders/service'
import {seedOrders, seedOrdersPerDay, server} from './mswServer'

const CHECKOUT_MS = 'http://localhost:3014/api/v0/checkout'

it('getAllOrders returns orders', async () => {
  const orders = await new OrderService().getAllOrders()
  expect(orders).toEqual(seedOrders)
})

it('getOrdersBySeller returns orders', async () => {
  const orders = await new OrderService().getOrdersBySeller('seller-1')
  expect(orders).toEqual(seedOrders)
})

it('getOrdersPerDay returns orders per day', async () => {
  const result = await new OrderService().getOrdersPerDay()
  expect(result).toEqual(seedOrdersPerDay)
})

it('getAllOrders throws on error response', async () => {
  server.use(http.get(`${CHECKOUT_MS}/orders/all`, () => new HttpResponse(null, {status: 500})))
  await expect(new OrderService().getAllOrders()).rejects.toThrow('Failed to fetch orders: 500')
})

it('getOrdersBySeller throws on error response', async () => {
  server.use(http.get(`${CHECKOUT_MS}/orders/by-seller`, () => new HttpResponse(null, {status: 500})))
  await expect(new OrderService().getOrdersBySeller('seller-1')).rejects.toThrow('Failed to fetch orders: 500')
})

it('getOrdersPerDay throws on error response', async () => {
  server.use(http.get(`${CHECKOUT_MS}/orders/per-day`, () => new HttpResponse(null, {status: 500})))
  await expect(new OrderService().getOrdersPerDay()).rejects.toThrow('Failed to fetch orders per day: 500')
})
