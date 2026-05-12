import {it, expect, vi} from 'vitest'
import {addToWishlist, getAllWishlistItems} from '../src/wishlist/actions'
import {milan94id, uswntid, brazilid} from '../vitest.setup'

vi.unmock('../src/wishlist/service');

it('returns an wishlistitem on add new', async () => {
  const res = await addToWishlist(milan94id)
  expect(res).toBeInstanceOf(Object)
})

it('adds new item to wishlist', async () => {
  await addToWishlist(brazilid)
  const getres = await getAllWishlistItems()
  expect(getres).toContainEqual(
    expect.objectContaining({ title: '1998 Brazil Away Jersey' })
  )
})

it('returns null on add duplicate', async () => {
  const res = await addToWishlist(uswntid)
  expect(res).toBeNull()
})
