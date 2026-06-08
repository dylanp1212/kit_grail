import {it, beforeEach, afterEach, vi} from 'vitest'
import supertest from 'supertest'

import {server} from './setup'
import {mockSession} from './sessionMock'

const SELLER_ID = '1830b53f-b49a-47eb-9a0e-d133a2bf5c3a'

// const testListing = {
//   seller: SELLER_ID,
//   title: 'Test Jersey',
//   description: 'This is a test Jersey',
//   size: 'large',
//   colors: ['blue', 'white'],
//   price: 154,
// }

beforeEach(() => {
  mockSession(SELLER_ID)
})

afterEach(() => {
  vi.restoreAllMocks()
})

it('No user id is rejected', async () => {
  vi.restoreAllMocks();
  await supertest(server)
    .patch(`/api/v0/kit-listing/b685a347-fe92-4e43-a551-0bbbaeafad6b`)
    .set('Authorization', 'Bearer jwe-token')
    .send({ title: 'Test' })
    // .then((res) => {
    //   console.log('res:', res.body);
    // })
    .expect(401)
  // mockSessionForbidden();
  // expect(mockSessionForbidden()).toBe(401)
});

it('Updating listing works', async () => {
  await supertest(server)
    .patch(`/api/v0/kit-listing/b685a347-fe92-4e43-a551-0bbbaeafad6b`)
    .set('Authorization', 'Bearer jwe-token')
    .send({ title: 'Test' })
    .expect(201)
})

it('returns 401 when session has empty id', async () => {
  mockSession('')
  await supertest(server)
    .patch(`/api/v0/kit-listing/b685a347-fe92-4e43-a551-0bbbaeafad6b`)
    .set('Authorization', 'Bearer jwe-token')
    .send({ title: 'Nope' })
    .expect(401)
})
