import { it, expect, vi } from 'vitest'
import { CartService } from '../src/shoppingcart/service'

vi.unmock('../src/shoppingcart/service')

const LISTING_ID = '8942027f-523a-4983-843b-0f12370aa1ea' // Random Jersey
const USER_ID = 'e86405c1-545b-4bef-912c-a9b01ee6d18f'    // Sally Shopper

it('addToCart adds listing to cart', async () => {
  const service = new CartService()
  await service.addToCart(LISTING_ID, USER_ID)
  const items = await service.getAllCartItems(USER_ID)
  expect(items).toContainEqual(expect.objectContaining({ title: 'Random Jersey' }))
})
