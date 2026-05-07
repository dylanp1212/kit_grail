import {it, expect, vi} from 'vitest'
import {addToWishlist, getAllWishlistItems} from '../src/wishlist/actions'
// import {WishlistItem} from '../src/wishlist'

vi.unmock('../src/wishlist/service');
const sallyid = 'e86405c1-545b-4bef-912c-a9b01ee6d18f'
const milan94id = 'b94d22a4-da78-40cc-8dca-3144ae30e962'
const uswntid = 'ad3852b2-2e1b-40e8-9400-668f6cfd2fe3'
const brazilid = 'd43ab28f-1fbf-4b03-87b1-7a1ede5ce45d'

it('returns an wishlistitem on add new', async () => {
  const getres = await getAllWishlistItems(sallyid)
  console.log(getres)
  const res = await addToWishlist(milan94id, sallyid)
  expect(res).toBeInstanceOf(Object)
})

it('adds new item to wishlist', async () => {
  const x = await addToWishlist(brazilid, sallyid)
  console.log(x)
  const getres = await getAllWishlistItems(sallyid)
  console.log(getres)
  expect(getres).toContainEqual(
    expect.objectContaining({ title: '1998 Brazil Away Jersey' })
  )
})

it('returns null on add duplicate', async () => {
  const res = await addToWishlist(uswntid, sallyid)
  expect(res).toBeNull()
})

// it('doesnt double add duplicate', async () => {
//   await addToWishlist(uswntid, sallyid)
//   const getres = await getAllWishlistItems(sallyid)
//   expect(getres).toBeNull()
// })

// it('gets listing with search matching description', async () => {
//   const res = await getAllWishlistItems('e86405c1-545b-4bef-912c-a9b01ee6d18f', 'barcelona')
//   expect(res).toContainEqual(
//     expect.objectContaining({ title: '2012 Barcelona Home Jersey Iniesta' })
//   )
// })

// it('doesnt get listing not matching search', async () => {
//   const res = await getAllWishlistItems('e86405c1-545b-4bef-912c-a9b01ee6d18f', 'barcelona')
//   expect(res).not.toContainEqual(
//     expect.objectContaining({ title: '2014 Argentina Messi Jersey' })
//   )
// })