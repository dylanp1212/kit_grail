import { it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CheckoutButton from '../src/app/shoppingcart/CheckoutButton'
import { mockRouter } from './mockRouter'
import { getSessionUser } from '../src/auth/actions'
import { createCheckoutSession } from '../src/checkout/service'

it('reroutes to login if user is not logged in', async () => {
  vi.mocked(getSessionUser).mockResolvedValueOnce(undefined)
  render(<CheckoutButton />)
  await userEvent.click(screen.getByRole('button', { name: /proceed to checkout/i }))
  expect(mockRouter.push).toHaveBeenCalledWith('/login?returnTo=/shoppingcart')
})

it('redirects to stripe url on successful checkout', async () => {
  render(<CheckoutButton />)
  await userEvent.click(screen.getByRole('button', { name: /proceed to checkout/i }))
  expect(mockRouter.push).toHaveBeenCalledWith('https://checkout.stripe.com/pay/test123')
})

it('passes success and cancel urls to checkout service', async () => {
  render(<CheckoutButton />)
  await userEvent.click(screen.getByRole('button', { name: /proceed to checkout/i }))
  expect(vi.mocked(createCheckoutSession)).toHaveBeenCalledWith(
    expect.any(String),
    expect.any(Array),
    expect.stringContaining('/checkout/success'),
    expect.stringContaining('/checkout/canceled'),
  )
})
