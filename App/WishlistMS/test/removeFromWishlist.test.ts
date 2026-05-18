import {it, expect} from 'vitest'
import {gql} from './setup'

const USER = 'e86405c1-545b-4bef-912c-a9b01ee6d18f'
const LISTING = '4d40647d-6691-4b8f-bec4-b93831e28e17'

it('returns result on good remove', async () => {
  await gql(`mutation { addToWishlist(userid: "${USER}", listingid: "${LISTING}") { id } }`)
  const res = await gql(`mutation { removeFromWishlist(userid: "${USER}", listingid: "${LISTING}") }`)
  expect(res.body.data.removeFromWishlist).not.toBeNull()
})


it('returns correct id on good remove', async () => {
  await gql(`mutation { addToWishlist(userid: "${USER}", listingid: "${LISTING}") { id } }`)
  const res = await gql(`mutation { removeFromWishlist(userid: "${USER}", listingid: "${LISTING}") }`)
  expect(res.body.data.removeFromWishlist).toEqual(LISTING)
})

it('actually removes from list on good remove', async () => {
  await gql(`mutation { addToWishlist(userid: "${USER}", listingid: "${LISTING}") { id } }`)
  await gql(`mutation { removeFromWishlist(userid: "${USER}", listingid: "${LISTING}") }`)
  const res = await gql(`query { getAllWishlistItems(userid: "${USER}") { title } }`)
  expect(res.body.data.getAllWishlistItems).not.toContainEqual(
    expect.objectContaining({ title: '2006 Italy Home Jersey' })
  )
})

it('returns error on remove bad id', async () => {
  const res = await gql(`mutation { removeFromWishlist(userid: "${USER}", listingid: "not-a-uuid") }`)
  expect(res.body.errors).toBeDefined()
})

