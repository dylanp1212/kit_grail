import {it, expect, vi} from 'vitest'
import {addToWishlist, removeFromWishlist, checkInWishlist} from '../src/wishlist/actions'
import {sallyid, milan94id} from '../vitest.setup'

vi.unmock('../src/wishlist/service');

it('returns wishlistitem on check item is in', async () => {
  await addToWishlist(milan94id, sallyid)
  const res = await checkInWishlist(milan94id, sallyid)
  expect(res).toBeTruthy()
})

it('returns undefined on check item isnt in', async () => {
  await removeFromWishlist(milan94id, sallyid)
  const res = await checkInWishlist(milan94id, sallyid)
  expect(res).toBeFalsy()
})

