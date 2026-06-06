
import { it, expect, vi } from 'vitest'
import { getAllKitListings } from '../src/kit_listing/actions'

vi.unmock('../src/kit_listing/service');
it('Gets all listings returns an array', async () => {
  const res = await getAllKitListings()
  expect(res).toBeInstanceOf(Array)
})

it('Gets all listings returns known listing', async () => {
  const res = await getAllKitListings()
  expect(res).toContainEqual(
    expect.objectContaining({ title: '2014 Argentina Messi Jersey' })
  )
})

it('gets listing with search matching description', async () => {
  const res = await getAllKitListings('home')
  expect(res).toContainEqual(
    expect.objectContaining({ title: '1994 AC Milan Home Jersey Maldini' })
  )
})

it('gets listing with search matching description', async () => {
  const res = await getAllKitListings('home')
  expect(res).toContainEqual(
    expect.objectContaining({ title: '2014 Argentina Messi Jersey' })
  )
})

it('doesnt get listing not matching search', async () => {
  const res = await getAllKitListings('home')
  expect(res).not.toContainEqual(
    expect.objectContaining({ title: '1998 Brazil Away Jersey' })
  )
})

it('gets listing with sellerId', async () => {
  const res = await getAllKitListings(undefined, 'mock-id')
  expect(res).toContainEqual(
    expect.objectContaining({ title: '1998 Brazil Away Jersey' })
  )
})

it('appends sizes to query params', async () => {
  const res = await getAllKitListings(undefined, undefined, { sizes: ['small'] })
  expect(res).toBeInstanceOf(Array)
})

it('appends colors to query params', async () => {
  const res = await getAllKitListings(undefined, undefined, { colors: ['red'] })
  expect(res).toBeInstanceOf(Array)
})