import {it, expect} from 'vitest'
import {http, HttpResponse} from 'msw'
import {SellerService} from '../src/sellers/service'
import {seedSellers, server} from './mswServer'

const AUTH_MS = 'http://localhost:3010/api/v0'

it('getAllSellers returns sellers', async () => {
  const sellers = await new SellerService().getAllSellers()
  expect(sellers).toEqual(seedSellers)
})

it('setSuspended resolves without error', async () => {
  await expect(new SellerService().setSuspended('seller-1', true)).resolves.toBeUndefined()
})

it('getAllSellers throws on error response', async () => {
  server.use(http.get(`${AUTH_MS}/sellers`, () => new HttpResponse(null, {status: 500})))
  await expect(new SellerService().getAllSellers()).rejects.toThrow('Failed to fetch sellers: 500')
})

it('setSuspended throws on error response', async () => {
  server.use(http.put(`${AUTH_MS}/sellers/:id/suspended`, () => new HttpResponse(null, {status: 500})))
  await expect(new SellerService().setSuspended('seller-1', true)).rejects.toThrow('Failed to update seller: 500')
})
