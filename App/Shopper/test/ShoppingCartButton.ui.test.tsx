import {vi, it, expect} from 'vitest'
import {routerSpy} from './mockRouter'
import {render, screen, fireEvent} from '@testing-library/react'
import ShoppingCartButton from '../src/components/ShoppingCartButton'

it('goes to shoppingcart on click', async () => {
  render(<ShoppingCartButton />)
  const button = await screen.findByLabelText('open shopping cart')
  fireEvent.click(button)
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith(`/shoppingcart`)
  })
})

it('shows item count badge', async () => {
  render(<ShoppingCartButton count={3} />)
  expect(screen.getByText('3')).toBeDefined()
})

it('hides badge when count is 0', async () => {
  render(<ShoppingCartButton count={0} />)
  expect(screen.queryByText('0')).toBeNull()
})

