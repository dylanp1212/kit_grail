import {it, expect} from 'vitest'
import {gql} from './setup'

const USER = 'e86405c1-545b-4bef-912c-a9b01ee6d18f'
const LISTING = 'ad3852b2-2e1b-40e8-9400-668f6cfd2fe3'

it('returns result on good check', async () => {
  const res = await gql(`query { checkInCart(userid: "${USER}", listingid: "${LISTING}") }`)
  expect(res.body.data.checkInCart).toBeDefined()
})

it('returns true when item is in cart', async () => {
  await gql(`mutation { addToCart(userid: "${USER}", listingid: "${LISTING}") }`)
  const res = await gql(`query { checkInCart(userid: "${USER}", listingid: "${LISTING}") }`)
  expect(res.body.data.checkInCart).toBe(true)
})

it('returns false when item is not in cart', async () => {
  await gql(`mutation { removeFromCart(userid: "${USER}", listingid: "${LISTING}") }`)
  const res = await gql(`query { checkInCart(userid: "${USER}", listingid: "${LISTING}") }`)
  expect(res.body.data.checkInCart).toBe(false)
})

it('returns error on badly formatted uuid', async () => {
  const res = await gql(`query { checkInCart(userid: "${USER}", listingid: "not-a-uuid") }`)
  expect(res.body.errors).toBeDefined()
})
