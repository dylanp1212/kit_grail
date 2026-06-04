import {it, vi, expect} from 'vitest'
import {render, screen} from '@testing-library/react'

import Page from '../src/app/orders/page'
import * as actions from '../src/orders/actions'

vi.mock('../src/orders/actions', () => ({
  getAllOrders: vi.fn(),
}))

it('renders orders page', async () => {
  vi.mocked(actions.getAllOrders).mockResolvedValueOnce([])
  render(await Page())
})

it('renders order items with seller info and total', async () => {
  vi.mocked(actions.getAllOrders).mockResolvedValueOnce([{
    id: 'order-1',
    status: 'paid',
    paid_at: '2026-06-01T12:00:00Z',
    shopper_id: 'shopper-1',
    shopper_name: 'Alice Shopper',
    shopper_email: 'alice@example.com',
    items: [
      {id: 'item-1', kit_listing: 'listing-1', title: '2019 USA Jersey', price: 150, seller_id: 'seller-1', seller_name: 'Bob Seller', seller_email: 'bob@example.com'},
      {id: 'item-2', kit_listing: 'listing-2', title: '2014 Argentina Jersey', price: 300, seller_id: 'seller-2', seller_name: 'Carol Seller', seller_email: 'carol@example.com'},
    ],
  }])
  render(await Page())
  expect(screen.getByText('2019 USA Jersey')).not.toBeNull()
  expect(screen.getByText('Bob Seller · bob@example.com')).not.toBeNull()
  expect(screen.getByText('$150.00')).not.toBeNull()
  expect(screen.getByText('Total: $450.00')).not.toBeNull()
})

it('shows em dash when paid_at is missing', async () => {
  vi.mocked(actions.getAllOrders).mockResolvedValueOnce([{
    id: 'order-1',
    status: 'paid',
    paid_at: '',
    shopper_id: 'shopper-1',
    shopper_name: 'Alice',
    shopper_email: 'alice@example.com',
    items: [],
  }])
  render(await Page())
  expect(screen.getByText('—')).not.toBeNull()
})