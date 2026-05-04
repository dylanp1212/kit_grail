
import { it, expect, vi } from 'vitest'
import { getAllWishlistItems } from '../src/wishlist/actions'

vi.unmock('../src/wishlist/service');
it('returns an array on get all', async () => {
  const res = await getAllWishlistItems('e86405c1-545b-4bef-912c-a9b01ee6d18f')
  expect(res).toBeInstanceOf(Array)
})

it('returns known listing on get all', async () => {
  const res = await getAllWishlistItems('e86405c1-545b-4bef-912c-a9b01ee6d18f')
  expect(res).toContainEqual(
    expect.objectContaining({ title: '2014 Argentina Messi Jersey' })
  )
})

it('gets listing with search matching description', async () => {
  const res = await getAllWishlistItems('e86405c1-545b-4bef-912c-a9b01ee6d18f', 'barcelona')
  expect(res).toContainEqual(
    expect.objectContaining({ title: '2012 Barcelona Home Jersey Iniesta' })
  )
})

it('doesnt get listing not matching search', async () => {
  const res = await getAllWishlistItems('e86405c1-545b-4bef-912c-a9b01ee6d18f', 'barcelona')
  expect(res).not.toContainEqual(
    expect.objectContaining({ title: '2014 Argentina Messi Jersey' })
  )
})