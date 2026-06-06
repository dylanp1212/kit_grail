import {it, expect, vi} from 'vitest'
import {mergeGuestCart} from '../src/shoppingcart/actions'
import {sallyid} from '../vitest.setup'

vi.unmock('../src/shoppingcart/service')


it('merges guest cart into user cart', async () => {
  const {CartService} = await import('../src/shoppingcart/service')
  const service = new CartService()
  await service.addToCart('ad3852b2-2e1b-40e8-9400-668f6cfd2fe3', sallyid)
  await service.addToCart('4d40647d-6691-4b8f-bec4-b93831e28e17', 'guest-abc-123')
  await mergeGuestCart()
  const items = await service.getAllCartItems(sallyid)
  expect(items).toHaveLength(2)
})

it('deletes guest cookie after merge', async () => {
  await mergeGuestCart()
  const {cookies} = await import('next/headers')
  const cookieStore = await vi.mocked(cookies).mock.results[0].value
  expect(cookieStore.delete).toHaveBeenCalledWith('guest_id')
})

it('returns early without merging when no user is authenticated', async () => {
  const {getSessionUser} = await import('../src/auth/actions')
  const {CartService} = await import('../src/shoppingcart/service')
  const spy = vi.spyOn(CartService.prototype, 'mergeCarts')
  vi.mocked(getSessionUser).mockResolvedValueOnce(undefined)
  await mergeGuestCart()
  expect(spy).not.toHaveBeenCalled()
  spy.mockRestore()
})

it('returns early without merging when no guest_id cookie exists', async () => {
  const {cookies} = await import('next/headers')
  const {CartService} = await import('../src/shoppingcart/service')
  const spy = vi.spyOn(CartService.prototype, 'mergeCarts')
  vi.mocked(cookies).mockResolvedValueOnce({
    get: vi.fn().mockReturnValue(undefined),
    set: vi.fn(),
    delete: vi.fn(),
  } as any)
  await mergeGuestCart()
  expect(spy).not.toHaveBeenCalled()
  spy.mockRestore()
})
