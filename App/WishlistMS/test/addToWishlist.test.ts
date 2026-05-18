import {it, expect} from 'vitest'
import {gql} from './setup'

const USER = 'e86405c1-545b-4bef-912c-a9b01ee6d18f'
const LISTING = '4d40647d-6691-4b8f-bec4-b93831e28e17'
const BAD_LISTING = 'badbadba-dbad-badb-ad51-0bbbaeafad6b'
const BAD_USER = 'badbadba-dbad-badb-ad51-0bbbaeafad6b'

it('returns item on good add', async () => {
  const res = await gql(`mutation {
    addToWishlist(userid: "${USER}", listingid: "${LISTING}") { id }
  }`)
  expect(res.body.data.addToWishlist).not.toBeNull()
})


it('returns correct item on good add', async () => {
  await gql(`mutation { removeFromWishlist(userid: "${USER}", listingid: "${LISTING}") }`)
  const res = await gql(`mutation {
    addToWishlist(userid: "${USER}", listingid: "${LISTING}") { title }
  }`)
  expect(res.body.data.addToWishlist.title).toEqual('2006 Italy Home Jersey')
})

it('actually adds item to wishlist on good add', async () => {
  await gql(`mutation { removeFromWishlist(userid: "${USER}", listingid: "${LISTING}") }`)
  await gql(`mutation { addToWishlist(userid: "${USER}", listingid: "${LISTING}") { id } }`)
  const res = await gql(`query {
    getAllWishlistItems(userid: "${USER}") { title }
  }`)
  expect(res.body.data.getAllWishlistItems).toContainEqual(
    expect.objectContaining({ title: '2006 Italy Home Jersey' })
  )
})

it('returns error on add already in', async () => {
  await gql(`mutation { addToWishlist(userid: "${USER}", listingid: "${LISTING}") { id } }`)
  const res = await gql(`mutation { addToWishlist(userid: "${USER}", listingid: "${LISTING}") { id } }`)
  expect(res.body.errors).toBeDefined()
})

it('returns error on add listing doesnt exist', async () => {
  const res = await gql(`mutation { addToWishlist(userid: "${USER}", listingid: "${BAD_LISTING}") { id } }`)
  expect(res.body.errors).toBeDefined()
})

it('returns error on add shopper doesnt exist', async () => {
  const res = await gql(`mutation { addToWishlist(userid: "${BAD_USER}", listingid: "${LISTING}") { id } }`)
  expect(res.body.errors).toBeDefined()
})

it('returns error on badly formatted uuid', async () => {
  const res = await gql(`mutation { addToWishlist(userid: "${USER}", listingid: "not-a-uuid") { id } }`)
  expect(res.body.errors).toBeDefined()
})

