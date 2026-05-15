import {it, expect, vi} from 'vitest'
import {addToWishlist, removeFromWishlist, checkInWishlist} from '../src/wishlist/actions'
import {milan94id} from '../vitest.setup'

vi.unmock('../src/wishlist/service');

it('returns true on check item is in', async () => {
  await addToWishlist(milan94id)
  const res = await checkInWishlist(milan94id)
  expect(res).toBeTruthy()
})

it('returns false on check item isnt in', async () => {
  await removeFromWishlist(milan94id)
  const res = await checkInWishlist(milan94id)
  expect(res).toBeFalsy()
})

it('returns false on no session user', async () => {
  const {getSessionUser} = await import('../src/auth/actions')
  vi.mocked(getSessionUser).mockResolvedValueOnce(undefined)
  const res = await checkInWishlist(milan94id)
  expect(res).toBeFalsy()
})

