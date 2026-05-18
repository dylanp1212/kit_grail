import {it, expect} from 'vitest'
import {gql} from './setup'

const USER = 'e86405c1-545b-4bef-912c-a9b01ee6d18f'
const LISTING = 'ad3852b2-2e1b-40e8-9400-668f6cfd2fe3'

it('returns listing id on good remove', async () => {
  await gql(`mutation { addToCart(userid: "${USER}", listingid: "${LISTING}") }`)
  const res = await gql(`mutation { removeFromCart(userid: "${USER}", listingid: "${LISTING}") }`)
  expect(res.body.data.removeFromCart).toEqual(LISTING)
})

it('actually removes item from cart on good remove', async () => {
  await gql(`mutation { addToCart(userid: "${USER}", listingid: "${LISTING}") }`)
  await gql(`mutation { removeFromCart(userid: "${USER}", listingid: "${LISTING}") }`)
  const res = await gql(`query { getAllCartItems(userid: "${USER}") { title } }`)
  expect(res.body.data.getAllCartItems).not.toContainEqual(
    expect.objectContaining({ title: '2019 USA Women World Cup Jersey Morgan' })
  )
})

it('returns error on badly formatted uuid', async () => {
  const res = await gql(`mutation { removeFromCart(userid: "${USER}", listingid: "not-a-uuid") }`)
  expect(res.body.errors).toBeDefined()
})
