
import { it, expect, vi } from 'vitest'
import { getAllWishlistItems } from '../src/wishlist/actions'

vi.unmock('../src/wishlist/service');
it('returns an array on get all', async () => {
  const res = await getAllWishlistItems()
  expect(res).toBeInstanceOf(Array)
})

it('returns known listing on get all', async () => {
  const res = await getAllWishlistItems()
  expect(res).toContainEqual(
    expect.objectContaining({ title: '2014 Argentina Messi Jersey' })
  )
})

it('gets listing with search matching description', async () => {
  const res = await getAllWishlistItems('barcelona')
  expect(res).toContainEqual(
    expect.objectContaining({ title: '2012 Barcelona Home Jersey Iniesta' })
  )
})

it('doesnt get listing not matching search', async () => {
  const res = await getAllWishlistItems('barcelona')
  expect(res).not.toContainEqual(
    expect.objectContaining({ title: '2014 Argentina Messi Jersey' })
  )
})

it('returns empty array on no session user', async () => {
  const {getSessionUser} = await import('../src/auth/actions')
  vi.mocked(getSessionUser).mockResolvedValueOnce(undefined)
  const res = await getAllWishlistItems()
  expect(res).toEqual([])
})