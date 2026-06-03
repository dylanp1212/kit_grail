import {it, expect, beforeEach, afterEach, vi} from 'vitest'
import supertest from 'supertest'

import {server} from './setup'
import {mockSession} from './sessionMock'

const SELLER_ID = '1830b53f-b49a-47eb-9a0e-d133a2bf5c3a'

const testListing = {
  seller: SELLER_ID,
  title: 'Test Jersey',
  description: 'This is a test Jersey',
  size: 'large',
  colors: ['blue', 'white'],
  price: 154,
  quantity: 1,
}

beforeEach(() => {
  mockSession(SELLER_ID)
})

afterEach(() => {
  vi.restoreAllMocks()
})

it('returns 401 without an Authorization header', async () => {
  vi.restoreAllMocks()
  await supertest(server)
    .post('/api/v0/kit-listing')
    .send({...testListing, title: 'No Auth'})
    .expect(401)
})

it('returns 201 on good create new', async () => {
  await supertest(server)
    .post('/api/v0/kit-listing')
    .set('Authorization', 'Bearer jwe-token')
    .send({...testListing, title: 'Test Jersey 1'})
    .expect(201)
})

it('returns the right listing on good create new', async () => {
  await supertest(server)
    .post('/api/v0/kit-listing')
    .set('Authorization', 'Bearer jwe-token')
    .send({...testListing, title: 'Test Jersey 2'})
    .then((res) => {
      expect(res.body.title).toEqual('Test Jersey 2')
    })
})

it('returns a listed date on good create new', async () => {
  await supertest(server)
    .post('/api/v0/kit-listing')
    .set('Authorization', 'Bearer jwe-token')
    .send({...testListing, title: 'Test Jersey 3'})
    .then((res) => {
      expect(res.body.listed).not.toBeNull()
    })
})

it('returns an id on good create new', async () => {
  await supertest(server)
    .post('/api/v0/kit-listing')
    .set('Authorization', 'Bearer jwe-token')
    .send({...testListing, title: 'Test Jersey 4'})
    .then((res) => {
      expect(res.body.id).not.toBeNull()
    })
})

it('has listing in sellers listings now', async () => {
  await supertest(server)
    .post('/api/v0/kit-listing')
    .set('Authorization', 'Bearer jwe-token')
    .send({...testListing, title: 'Test Jersey 5'})
  await supertest(server)
    .get(`/api/v0/kit-listing?sellerId=${SELLER_ID}`)
    .then((res) => {
      expect(res.body).toContainEqual(
        expect.objectContaining({ title: 'Test Jersey 5' })
      )
    })
})

it('seller in body is overridden by session id', async () => {
  const res = await supertest(server)
    .post('/api/v0/kit-listing')
    .set('Authorization', 'Bearer jwe-token')
    .send({...testListing, seller: 'evil-other-seller', title: 'Test Jersey 6'})
    .expect(201)
  expect(res.body.seller).toBe(SELLER_ID)
})
