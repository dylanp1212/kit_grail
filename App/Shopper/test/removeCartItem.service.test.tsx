import { it, expect, vi } from 'vitest'
import { removeFromCart } from '../src/shoppingcart/actions'

vi.unmock('../src/shoppingcart/service');
it('removes known listing', async () => {
  const res = await removeFromCart('e86405c1-545b-4bef-912c-a9b01ee6d18f')
  expect(res).toEqual('e86405c1-545b-4bef-912c-a9b01ee6d18f' 
  )
})
