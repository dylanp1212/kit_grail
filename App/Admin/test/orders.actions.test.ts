import {it, expect} from 'vitest'
import {getAllOrders, getOrdersBySeller, getOrdersPerDay} from '../src/orders/actions'
import {seedOrders, seedOrdersPerDay} from './mswServer'

it('getAllOrders returns orders', async () => {
  const orders = await getAllOrders()
  expect(orders).toEqual(seedOrders)
})

it('getOrdersBySeller returns orders for a seller', async () => {
  const orders = await getOrdersBySeller('seller-1')
  expect(orders).toEqual(seedOrders)
})

it('getOrdersPerDay returns daily order counts', async () => {
  const result = await getOrdersPerDay()
  expect(result).toEqual(seedOrdersPerDay)
})
