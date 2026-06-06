import {it, expect, vi} from 'vitest'
import {http, HttpResponse} from 'msw'
import {server} from './mswServer'
import {CartService} from '../src/shoppingcart/service'

vi.unmock('../src/shoppingcart/service')

const gqlError = () =>
  server.use(
    http.post('http://localhost:3015/graphql', () =>
      HttpResponse.json({ errors: [{ message: 'server error' }] }), { once: true }
    )
  )

it('getAllCartItems throws on GraphQL error', async () => {
  gqlError()
  await expect(new CartService().getAllCartItems('user-id')).rejects.toThrow()
})

it('addToCart throws on GraphQL error', async () => {
  gqlError()
  await expect(new CartService().addToCart('listing-id', 'user-id')).rejects.toThrow()
})

it('removeFromCart throws on GraphQL error', async () => {
  gqlError()
  await expect(new CartService().removeFromCart('listing-id', 'user-id')).rejects.toThrow()
})

it('checkInCart returns false on GraphQL error', async () => {
  gqlError()
  const result = await new CartService().checkInCart('listing-id', 'user-id')
  expect(result).toBe(false)
})

it('createGuestShopper throws on GraphQL error', async () => {
  gqlError()
  await expect(new CartService().createGuestShopper()).rejects.toThrow()
})

it('clearCart throws on GraphQL error', async () => {
  gqlError()
  await expect(new CartService().clearCart('user-id')).rejects.toThrow()
})

it('mergeCarts throws on GraphQL error', async () => {
  gqlError()
  await expect(new CartService().mergeCarts('guest-id', 'user-id')).rejects.toThrow()
})
