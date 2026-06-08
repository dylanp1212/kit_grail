import {it, expect, vi} from 'vitest'
import {render, waitFor} from '@testing-library/react'
import CartList from '../src/app/shoppingcart/CartList'
import * as actions from '../src/shoppingcart/actions'
import {mockItems} from '../vitest.setup'

it('auto-removes items whose quantity has dropped to 0', async () => {
  const soldOut = {...mockItems[0], quantity: 0}
  const inStock = {...mockItems[1], quantity: 5}
  vi.spyOn(actions, 'getAllCartItems').mockResolvedValue([soldOut, inStock])
  const removeSpy = vi.spyOn(actions, 'removeFromCart').mockResolvedValue(soldOut.id)

  render(<CartList />)

  await waitFor(() => {
    expect(removeSpy).toHaveBeenCalledWith(soldOut.id)
  })
})
