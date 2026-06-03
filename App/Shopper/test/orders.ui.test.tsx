import {it, expect, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import {http, HttpResponse} from 'msw'
import {server} from './mswServer'
import OrdersPage from '../src/app/orders/page'
import {getSessionUser} from '../src/auth/actions'

const ORDERS_URL = 'http://localhost:3014/api/v0/checkout/orders/by-shopper'

it('renders empty state when there are no orders', async () => {
  render(await OrdersPage())
  expect(screen.getByText(/no orders yet/i)).not.toBeNull()
})

it('renders empty state when user is not logged in', async () => {
  vi.mocked(getSessionUser).mockResolvedValueOnce(undefined)
  render(await OrdersPage())
  expect(screen.getByText(/no orders yet/i)).not.toBeNull()
})

it('renders order with items, total, and status', async () => {
  server.use(
    http.get(ORDERS_URL, () => HttpResponse.json([{
      id: 'o1',
      status: 'paid',
      paid_at: '2026-05-01T10:00:00Z',
      items: [
        {id: 'i1', kit_listing: 'k1', title: 'Messi Jersey', price: 300},
        {id: 'i2', kit_listing: 'k2', title: 'Italy Jersey', price: 134},
      ],
    }]))
  )
  render(await OrdersPage())
  expect(screen.getByText('Messi Jersey')).not.toBeNull()
  expect(screen.getByText('Italy Jersey')).not.toBeNull()
  expect(screen.getByText(/Total: \$434\.00/)).not.toBeNull()
  expect(screen.getByText('paid')).not.toBeNull()
})
