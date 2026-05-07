import { it, expect, vi } from 'vitest'
import { getAllCartItems } from '../src/shoppingcart/actions'

vi.unmock('../src/shoppingcart/service');
it('returns an array on get all', async () => {
  const res = await getAllCartItems('e86405c1-545b-4bef-912c-a9b01ee6d18f')
  expect(res).toBeInstanceOf(Array)
})

// it('returns known listing on get all', async () => {
//   const res = await getAllCartItems('e86405c1-545b-4bef-912c-a9b01ee6d18f')
//   expect(res).toContainEqual(
//     expect.objectContaining({ title: '2019 USA Women World Cup Jersey Morgan' })
//   )
// })
