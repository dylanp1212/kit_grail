import { it, expect, vi } from 'vitest'
import { CartService } from '../src/shoppingcart/service'
import { sallyid } from '../vitest.setup'

vi.unmock('../src/shoppingcart/service')

const LISTING_ID = '8942027f-523a-4983-843b-0f12370aa1ea' // Random Jersey

it('addToCart adds listing to cart', async () => {
  const service = new CartService()
  await service.addToCart(LISTING_ID, sallyid)
  const items = await service.getAllCartItems(sallyid)
  expect(items).toContainEqual(expect.objectContaining({ title: 'Random Jersey' }))
})
