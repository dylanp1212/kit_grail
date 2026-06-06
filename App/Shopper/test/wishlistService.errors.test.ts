import {it, expect, vi} from 'vitest'
import {http, HttpResponse} from 'msw'
import {server} from './mswServer'
import {WishlistService} from '../src/wishlist/service'

vi.unmock('../src/wishlist/service')

const gqlError = () =>
  server.use(
    http.post('http://localhost:3012/graphql', () =>
      HttpResponse.json({ errors: [{ message: 'server error' }] }), { once: true }
    )
  )

it('getAllWishlistItems throws on GraphQL error', async () => {
  gqlError()
  await expect(new WishlistService().getAllWishlistItems('user-id')).rejects.toThrow()
})

it('checkInWishlist returns false on GraphQL error', async () => {
  gqlError()
  const result = await new WishlistService().checkInWishlist('listing-id', 'user-id')
  expect(result).toBe(false)
})
