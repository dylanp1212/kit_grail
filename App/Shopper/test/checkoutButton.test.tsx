import { it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CheckoutButton from '../src/app/shoppingcart/CheckoutButton'
import { CartCountContext } from '../src/shoppingcart/CartCountContext'
import { mockRouter } from './mockRouter'
import { getSessionUser } from '../src/auth/actions'
import { createCheckoutSession } from '../src/checkout/service'

const renderWithCart = (count: number) => render(
  <CartCountContext.Provider value={{ count, increment: vi.fn(), decrement: vi.fn() }}>
    <CheckoutButton />
  </CartCountContext.Provider>
)

it('does not render when cart is empty', () => {
  renderWithCart(0)
  expect(screen.queryByRole('button', { name: /proceed to checkout/i })).toBeNull()
})

it('reroutes to login if user is not logged in', async () => {
  vi.mocked(getSessionUser).mockResolvedValueOnce(undefined)
  renderWithCart(1)
  await userEvent.click(screen.getByRole('button', { name: /proceed to checkout/i }))
  expect(mockRouter.push).toHaveBeenCalledWith('/login?returnTo=/shoppingcart')
})

it('redirects to stripe url on successful checkout', async () => {
  renderWithCart(1)
  await userEvent.click(screen.getByRole('button', { name: /proceed to checkout/i }))
  expect(mockRouter.push).toHaveBeenCalledWith('https://checkout.stripe.com/pay/test123')
})

it('passes success and cancel urls to checkout service', async () => {
  renderWithCart(1)
  await userEvent.click(screen.getByRole('button', { name: /proceed to checkout/i }))
  expect(vi.mocked(createCheckoutSession)).toHaveBeenCalledWith(
    expect.any(String),
    expect.any(Array),
    expect.stringContaining('/checkout/success'),
    expect.stringContaining('/checkout/canceled'),
  )
})
