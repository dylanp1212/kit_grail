import {it, expect, vi} from 'vitest'
import {addToWishlist, removeFromWishlist, getAllWishlistItems} from '../src/wishlist/actions'
// import {WishlistItem} from '../src/wishlist'
import {milan94id, uswntid, brazilid} from '../vitest.setup'

vi.unmock('../src/wishlist/service');
// const sallyid = 'e86405c1-545b-4bef-912c-a9b01ee6d18f'
// const milan94id = 'b94d22a4-da78-40cc-8dca-3144ae30e962'
// const uswntid = 'ad3852b2-2e1b-40e8-9400-668f6cfd2fe3'
// const brazilid = 'd43ab28f-1fbf-4b03-87b1-7a1ede5ce45d'

it('returns correct id on remove', async () => {
  await addToWishlist(milan94id)
  const res = await removeFromWishlist(milan94id)
  expect(res).toEqual(milan94id)
})

it('removes from wishlist on remove', async () => {
  await addToWishlist(brazilid)
  await removeFromWishlist(brazilid)
  const getres = await getAllWishlistItems()
  // console.log(getres)
  expect(getres).not.toContainEqual(
    expect.objectContaining({ title: '1998 Brazil Away Jersey' })
  )
})

it('returns empty string on no session user', async () => {
  const {getSessionUser} = await import('../src/auth/actions')
  vi.mocked(getSessionUser).mockResolvedValueOnce(undefined)
  const res = await removeFromWishlist(milan94id)
  expect(res).toEqual('')
})