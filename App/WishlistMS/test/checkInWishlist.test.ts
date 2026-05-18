import {it, expect} from 'vitest'
import {gql} from './setup'

const USER = 'e86405c1-545b-4bef-912c-a9b01ee6d18f'
const LISTING = '4d40647d-6691-4b8f-bec4-b93831e28e17'

it('returns result on good check', async () => {
  const res = await gql(`query {
    checkInWishlist(userid: "${USER}", listingid: "${LISTING}")
  }`)
  expect(res.body.data.checkInWishlist).toBeDefined()
})

it('returns true on check when item in list', async () => {
  await gql(`mutation { addToWishlist(userid: "${USER}", listingid: "${LISTING}") { id } }`)
  const res = await gql(`query { checkInWishlist(userid: "${USER}", listingid: "${LISTING}") }`)
  expect(res.body.data.checkInWishlist).toBe(true)
})


it('returns false on check when item not in list', async () => {
  await gql(`mutation { removeFromWishlist(userid: "${USER}", listingid: "${LISTING}") }`)
  const res = await gql(`query { checkInWishlist(userid: "${USER}", listingid: "${LISTING}") }`)
  expect(res.body.data.checkInWishlist).toBe(false)
})


it('returns error on bad uuid', async () => {
  const res = await gql(`query { checkInWishlist(userid: "${USER}", listingid: "not-a-uuid") }`)
  expect(res.body.errors).toBeDefined()
})
