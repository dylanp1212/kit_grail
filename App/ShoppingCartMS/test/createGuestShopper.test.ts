import {it, expect} from 'vitest'
import {gql} from './setup'

it('creates a guest shopper and returns a uuid', async () => {
  const res = await gql(`mutation { createGuestShopper }`)
  expect(res.body.data.createGuestShopper).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
  )
})

it('creates unique guest shoppers on each call', async () => {
  const res1 = await gql(`mutation { createGuestShopper }`)
  const res2 = await gql(`mutation { createGuestShopper }`)
  expect(res1.body.data.createGuestShopper).not.toBe(res2.body.data.createGuestShopper)
})
