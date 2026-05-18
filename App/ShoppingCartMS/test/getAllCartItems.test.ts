import {it, expect} from 'vitest'
import {gql} from './setup'

const USER = 'e86405c1-545b-4bef-912c-a9b01ee6d18f'

it('returns array on get all', async () => {
  const res = await gql(`query {
    getAllCartItems(userid: "${USER}") { id title }
  }`)
  expect(res.body.data.getAllCartItems).toBeInstanceOf(Array)
})

it('returns correct number of items on get all', async () => {
  const res = await gql(`query {
    getAllCartItems(userid: "${USER}") { id }
  }`)
  expect(res.body.data.getAllCartItems).toHaveLength(1)
})

it('returns correct item on get all', async () => {
  const res = await gql(`query {
    getAllCartItems(userid: "${USER}") { title }
  }`)
  expect(res.body.data.getAllCartItems).toContainEqual(
    expect.objectContaining({ title: '2019 USA Women World Cup Jersey Morgan' })
  )
})

it('returns error on badly formatted uuid', async () => {
  const res = await gql(`query {
    getAllCartItems(userid: "not-a-uuid") { id }
  }`)
  expect(res.body.errors).toBeDefined()
})
