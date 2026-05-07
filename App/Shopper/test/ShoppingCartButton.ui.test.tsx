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