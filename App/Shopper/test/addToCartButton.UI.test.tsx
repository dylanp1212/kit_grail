import {it, expect} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddToCartButton from '../src/components/AddToCartButton'
import ViewListingAddToCartButton from '../src/app/viewlisting/AddToCartButton'

const LISTING_ID = 'b94d22a4-da78-40cc-8dca-3144ae30e962'

it('renders add to cart button', () => {
  render(<AddToCartButton listingid={LISTING_ID} />)
  const button = screen.getByRole('button', { name: /add to cart/i })
  expect(button).not.toBeNull()
})

it('disables button after click', async () => {
  render(<AddToCartButton listingid={LISTING_ID} />)
  const button = screen.getByRole('button', { name: /add to cart/i })
  expect((button as HTMLButtonElement).disabled).toBe(false)
  await userEvent.click(button)
  expect((button as HTMLButtonElement).disabled).toBe(true)
})

it('shows check icon after click', async () => {
  render(<AddToCartButton listingid={LISTING_ID} />)
  const button = screen.getByRole('button', { name: /add to cart/i })
  expect(screen.queryByTestId('CheckCircleIcon')).toBeNull()
  await userEvent.click(button)
  expect(screen.queryByTestId('CheckCircleIcon')).not.toBeNull()
})

it('shows added to cart text after click (viewlisting)', async () => {
  render(<ViewListingAddToCartButton listingid={LISTING_ID} />)
  await userEvent.click(screen.getByRole('button', { name: /add to cart/i }))
  expect(screen.getByRole('button', { name: /added to cart/i })).not.toBeNull()
})
