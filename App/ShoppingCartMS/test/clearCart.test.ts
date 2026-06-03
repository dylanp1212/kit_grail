import {it, expect} from 'vitest'
import {gql} from './setup'

const USER = 'e86405c1-545b-4bef-912c-a9b01ee6d18f' // Sally shopper

it('returns true on successful clear', async () => {
  const res = await gql(`mutation { clearCart(userid: "${USER}") }`)
  expect(res.body.data.clearCart).toBe(true)
})

// Sally already has one item in her cart

it('cart is empty after clearing', async () => {
  await gql(`mutation { clearCart(userid: "${USER}") }`)
  const res = await gql(`query { getAllCartItems(userid: "${USER}") { id } }`)
  expect(res.body.data.getAllCartItems).toHaveLength(0)
})

