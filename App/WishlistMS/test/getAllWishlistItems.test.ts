import {it, expect} from 'vitest'
import {gql} from './setup';

const USER = 'e86405c1-545b-4bef-912c-a9b01ee6d18f'

it('returns results on get all', async () => {
  const res = await gql(`query {
    getAllWishlistItems(userid: "${USER}") { id title }
  }`)
  expect(res.body.data.getAllWishlistItems).toBeDefined()
})

it('returns correct number of listings on get all', async () => {
  const res = await gql(`query {
    getAllWishlistItems(userid: "${USER}") { id }
  }`)
  expect(res.body.data.getAllWishlistItems).toHaveLength(3)
})


it('returns correct listing on good search', async () => {
  const res = await gql(`query {
    getAllWishlistItems(userid: "${USER}", search: "messi") { title }
  }`)
  expect(res.body.data.getAllWishlistItems).toContainEqual(
    expect.objectContaining({ title: '2014 Argentina Messi Jersey' })
  )
})


it('doesnt return incorrect listing on good search', async () => {
  const res = await gql(`query {
    getAllWishlistItems(userid: "${USER}", search: "messi") { title }
  }`)
  expect(res.body.data.getAllWishlistItems).not.toContainEqual(
    expect.objectContaining({ title: '2006 Italy Home Jersey' })
  )
})


it('returns empty array on bad search', async () => {
  const res = await gql(`query {
    getAllWishlistItems(userid: "${USER}", search: "aafasdfasdf") { id }
  }`)
  expect(res.body.data.getAllWishlistItems).toHaveLength(0)
})


it('returns error on badly formatted uuid', async () => {
  const res = await gql(`query {
    getAllWishlistItems(userid: "not-a-uuid") { id }
  }`)
  expect(res.body.errors).toBeDefined()
})
