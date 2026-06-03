import {it, expect} from 'vitest'
import {gql} from './setup'

const USER = 'e86405c1-545b-4bef-912c-a9b01ee6d18f' // Sally shopper
const OTHER_USER = '3436e28c-8d0f-42e1-a733-eb42358ca451' // Tommy shopper
const LISTING_2 = '5e25b4f0-2ef4-4ec0-8ae0-e97ca701eb74' // another listing

it('returns true on successful clear', async () => {
  const res = await gql(`mutation { clearCart(userid: "${USER}") }`)
  expect(res.body.data.clearCart).toBe(true)
})

it('cart is empty after clearing', async () => {
  await gql(`mutation { clearCart(userid: "${USER}") }`)
  const res = await gql(`query { getAllCartItems(userid: "${USER}") { id } }`)
  expect(res.body.data.getAllCartItems).toHaveLength(0)
})

