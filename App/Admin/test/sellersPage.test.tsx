import {it, vi, expect} from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'

import Page from '../src/app/sellers/page'
import * as sellerActions from '../src/sellers/actions'

vi.mock('../src/sellers/actions', () => ({
  getAllSellers: vi.fn(),
  setSuspended: vi.fn(),
}))

const activeSeller = {id: 'seller-1', name: 'Bob Seller', email: 'bob@example.com', suspended: false}
const suspendedSeller = {id: 'seller-1', name: 'Bob Seller', email: 'bob@example.com', suspended: true}

it('renders sellers page', async () => {
  vi.mocked(sellerActions.getAllSellers).mockResolvedValueOnce([activeSeller])
  render(await Page())
})

it('suspends an active seller', async () => {
  vi.mocked(sellerActions.getAllSellers).mockResolvedValueOnce([activeSeller])
  vi.mocked(sellerActions.setSuspended).mockResolvedValueOnce(undefined)
  render(await Page())
  fireEvent.click(screen.getByRole('button', {name: /suspend/i}))
  await vi.waitFor(() => {
    expect(sellerActions.setSuspended).toHaveBeenCalledWith('seller-1', true)
  })
})

it('unsuspends a suspended seller', async () => {
  vi.mocked(sellerActions.getAllSellers).mockResolvedValueOnce([suspendedSeller])
  vi.mocked(sellerActions.setSuspended).mockResolvedValueOnce(undefined)
  render(await Page())
  fireEvent.click(screen.getByRole('button', {name: /unsuspend/i}))
  await vi.waitFor(() => {
    expect(sellerActions.setSuspended).toHaveBeenCalledWith('seller-1', false)
  })
})
