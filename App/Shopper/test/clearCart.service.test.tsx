import {it, expect, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import {CartService} from '../src/shoppingcart/service'
import CartList from '../src/app/shoppingcart/CartList'
import {sallyid, mockItems} from '../vitest.setup'

vi.unmock('../src/shoppingcart/service')

const LISTING_1 = '8942027f-523a-4983-843b-0f12370aa1ea'
const LISTING_2 = '5e25b4f0-2ef4-4ec0-8ae0-e97ca701eb74'

it('clearCart returns true', async () => {
  const service = new CartService()
  const result = await service.clearCart(sallyid)
  expect(result).toBe(true)
})

it('clearCart removes all items from cart', async () => {
  const service = new CartService()
  await service.addToCart(LISTING_1, sallyid)
  await service.addToCart(LISTING_2, sallyid)
  await service.clearCart(sallyid)
  const items = await service.getAllCartItems(sallyid)
  expect(items).toHaveLength(0)
})