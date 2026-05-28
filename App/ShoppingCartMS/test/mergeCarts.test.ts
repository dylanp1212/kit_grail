import {it, expect} from 'vitest'
import {gql} from './setup'

const USER = 'e86405c1-545b-4bef-912c-a9b01ee6d18f' // Sally Shopper
const LISTING_A = 'ad3852b2-2e1b-40e8-9400-668f6cfd2fe3' // Sally already has this in her cart
const LISTING_B = '4d40647d-6691-4b8f-bec4-b93831e28e17'

// create guest shopper for cart
async function createGuest(): Promise<string> {
  const res = await gql(`mutation { createGuestShopper }`)
  return res.body.data.createGuestShopper as string
}

it('combines items from both carts', async () => {
  const guestId = await createGuest()
  await gql(`mutation { addToCart(userid: "${guestId}", listingid: "${LISTING_B}") }`)
  await gql(`mutation { mergeCarts(guestId: "${guestId}", userId: "${USER}") }`)
  const res = await gql(`query { getAllCartItems(userid: "${USER}") { id } }`)
  expect(res.body.data.getAllCartItems).toContainEqual(expect.objectContaining({ id: LISTING_A }))
  expect(res.body.data.getAllCartItems).toContainEqual(expect.objectContaining({ id: LISTING_B }))
})

it('does not duplicate items that exist in both carts', async () => {
  const guestId = await createGuest()
  await gql(`mutation { addToCart(userid: "${guestId}", listingid: "${LISTING_A}") }`)
  await gql(`mutation { mergeCarts(guestId: "${guestId}", userId: "${USER}") }`)
  const res = await gql(`query { getAllCartItems(userid: "${USER}") { id } }`)
  expect(res.body.data.getAllCartItems).toHaveLength(1)
})

it('guest shopper is deleted after merge', async () => {
  const guestId = await createGuest()
  await gql(`mutation { mergeCarts(guestId: "${guestId}", userId: "${USER}") }`)
  const res = await gql(`mutation { addToCart(userid: "${guestId}", listingid: "${LISTING_A}") }`)
  // add to cart should fail for deleted guest shopper
  expect(res.body.errors).toBeDefined()
})
