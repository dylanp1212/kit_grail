import { it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CheckoutSuccessPage from '../src/app/checkout/success/page'
import CheckoutCanceledPage from '../src/app/checkout/canceled/page'

it('success: renders order placed confirmation and continue shopping link', () => {
  render(<CheckoutSuccessPage />)
  expect(screen.getByTestId('CheckCircleIcon')).not.toBeNull()
  expect(screen.getByText('Order placed!')).not.toBeNull()
  expect(screen.getByText(/payment was successful/i)).not.toBeNull()
  expect(screen.getByRole('link', { name: /continue shopping/i })).not.toBeNull()
})

it('success: continue shopping links to /listings', () => {
  render(<CheckoutSuccessPage />)
  const link = screen.getByRole('link', { name: /continue shopping/i }) as HTMLAnchorElement
  expect(link.href).toContain('/listings')
})

it('canceled: renders order canceled message and back to cart link', () => {
  render(<CheckoutCanceledPage />)
  expect(screen.getByTestId('HighlightOffIcon')).not.toBeNull()
  expect(screen.getByText('Order canceled')).not.toBeNull()
  expect(screen.getByText(/payment was not completed/i)).not.toBeNull()
  expect(screen.getByRole('link', { name: /back to cart/i })).not.toBeNull()
})

it('canceled: back to cart links to /shoppingcart', () => {
  render(<CheckoutCanceledPage />)
  const link = screen.getByRole('link', { name: /back to cart/i }) as HTMLAnchorElement
  expect(link.href).toContain('/shoppingcart')
})
