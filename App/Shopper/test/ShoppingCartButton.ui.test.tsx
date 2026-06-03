import {vi, it, expect} from 'vitest'
import {routerSpy} from './mockRouter'
import {render, screen, fireEvent} from '@testing-library/react'
import ShoppingCartButton from '../src/components/ShoppingCartButton'
import {useCartCount} from '../src/shoppingcart/CartCountContext'

vi.mock('../src/shoppingcart/CartCountContext', () => ({
  useCartCount: vi.fn(),
}))

it('goes to shoppingcart on click', async () => {
  vi.mocked(useCartCount).mockReturnValue({count: 0, increment: vi.fn(), decrement: vi.fn()})
  render(<ShoppingCartButton />)
  const button = await screen.findByLabelText('open shopping cart')
  fireEvent.click(button)
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith(`/shoppingcart`)
  })
})

it('shows item count badge', async () => {
  vi.mocked(useCartCount).mockReturnValue({count: 3, increment: vi.fn(), decrement: vi.fn()})
  render(<ShoppingCartButton />)
  expect(screen.getByText('3')).toBeDefined()
})

it('hides badge when count is 0', async () => {
  vi.mocked(useCartCount).mockReturnValue({count: 0, increment: vi.fn(), decrement: vi.fn()})
  render(<ShoppingCartButton />)
  expect(screen.queryByText('0')).toBeNull()
})
