import {it, expect} from 'vitest'
import {gql} from './setup'

const USER = 'e86405c1-545b-4bef-912c-a9b01ee6d18f'
const LISTING = '4d40647d-6691-4b8f-bec4-b93831e28e17'

it('returns listing id on good add', async () => {
  await gql(`mutation { removeFromCart(userid: "${USER}", listingid: "${LISTING}") }`)
  const res = await gql(`mutation {
    addToCart(userid: "${USER}", listingid: "${LISTING}")
  }`)
  expect(res.body.data.addToCart).toEqual(LISTING)
})

it('actually adds item to cart on good add', async () => {
  await gql(`mutation { removeFromCart(userid: "${USER}", listingid: "${LISTING}") }`)
  await gql(`mutation { addToCart(userid: "${USER}", listingid: "${LISTING}") }`)
  const res = await gql(`query {
    getAllCartItems(userid: "${USER}") { title }
  }`)
  expect(res.body.data.getAllCartItems).toContainEqual(
    expect.objectContaining({ title: '2006 Italy Home Jersey' })
  )
})

it('is idempotent on duplicate add', async () => {
  await gql(`mutation { addToCart(userid: "${USER}", listingid: "${LISTING}") }`)
  const res = await gql(`mutation { addToCart(userid: "${USER}", listingid: "${LISTING}") }`)
  expect(res.body.errors).toBeUndefined()
})

it('returns error on badly formatted listing uuid', async () => {
  const res = await gql(`mutation { addToCart(userid: "${USER}", listingid: "not-a-uuid") }`)
  expect(res.body.errors).toBeDefined()
})

it('returns error on badly formatted user uuid', async () => {
  const res = await gql(`mutation { addToCart(userid: "not-a-uuid", listingid: "${LISTING}") }`)
  expect(res.body.errors).toBeDefined()
})
