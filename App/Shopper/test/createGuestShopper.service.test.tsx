import {it, expect, vi} from 'vitest'
import {CartService} from '../src/shoppingcart/service'

vi.unmock('../src/shoppingcart/service');

it('creates guest shopper', async () => {
  const res = await new CartService().createGuestShopper()
  expect(res).toMatch(/^[0-9a-f-]{36}$/)
})

it('creates unique guest shoppers', async () => {
  const res1 = await new CartService().createGuestShopper()
  const res2 = await new CartService().createGuestShopper()
  expect(res1).not.toBe(res2)
})