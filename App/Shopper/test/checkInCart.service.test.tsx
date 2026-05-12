import {it, expect, vi} from 'vitest'
import {CartService} from '../src/shoppingcart/service'
import {sallyid, milan94id} from '../vitest.setup'

vi.unmock('../src/shoppingcart/service');

it('returns true on check item is in cart', async () => {
  await new CartService().addToCart(milan94id, sallyid)
  const res = await new CartService().checkInCart(milan94id, sallyid)
  expect(res).toBeTruthy()
})

it('returns false on check item isnt in cart', async () => {
  await new CartService().removeFromCart(milan94id, sallyid)
  const res = await new CartService().checkInCart(milan94id, sallyid)
  expect(res).toBeFalsy()
})
