import { it, vi, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CartCountProvider, useCartCount } from '../src/shoppingcart/CartCountContext'
import * as cartActions from '../src/shoppingcart/actions'
import { mockItems } from '../vitest.setup'

function Consumer() {
  const { count, increment, decrement } = useCartCount()
  return (
    <>
      <span data-testid="count">{count}</span>
      <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button>
    </>
  )
}

it('initialises count from getAllCartItems', async () => {
  render(<CartCountProvider><Consumer /></CartCountProvider>)
  await vi.waitFor(() => {
    expect(screen.getByTestId('count').textContent).toBe(String(mockItems.length))
  })
})

it('increment increases count', async () => {
  render(<CartCountProvider><Consumer /></CartCountProvider>)
  await vi.waitFor(() => expect(screen.getByTestId('count').textContent).toBe(String(mockItems.length)))
  fireEvent.click(screen.getByText('increment'))
  expect(screen.getByTestId('count').textContent).toBe(String(mockItems.length + 1))
})

it('decrement decreases count', async () => {
  render(<CartCountProvider><Consumer /></CartCountProvider>)
  await vi.waitFor(() => expect(screen.getByTestId('count').textContent).toBe(String(mockItems.length)))
  fireEvent.click(screen.getByText('decrement'))
  expect(screen.getByTestId('count').textContent).toBe(String(mockItems.length - 1))
})

it('decrement does not go below zero', async () => {
  vi.spyOn(cartActions, 'getAllCartItems').mockResolvedValueOnce([])
  render(<CartCountProvider><Consumer /></CartCountProvider>)
  await vi.waitFor(() => expect(screen.getByTestId('count').textContent).toBe('0'))
  fireEvent.click(screen.getByText('decrement'))
  expect(screen.getByTestId('count').textContent).toBe('0')
})

it('count stays 0 when getAllCartItems rejects', async () => {
  vi.spyOn(cartActions, 'getAllCartItems').mockRejectedValueOnce(new Error('network error'))
  render(<CartCountProvider><Consumer /></CartCountProvider>)
  await vi.waitFor(() => {
    expect(screen.getByTestId('count').textContent).toBe('0')
  })
})
