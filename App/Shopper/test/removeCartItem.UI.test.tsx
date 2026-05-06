import { it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CartList from '../src/app/shoppingcart/CartList'
import { mockItems } from '../vitest.setup'

const listing = mockItems[0]

it('removes item from cart on click', async () => {
  render(<CartList />)
  const buttons = await screen.findAllByLabelText('remove from cart')
  fireEvent.click(buttons[0])
  await waitFor(() => {
    expect(screen.queryByText(listing.title)).toBeNull()
  })
})
