import {it, expect} from 'vitest'
import supertest from 'supertest'
import {server} from './setup'

it('returns 201 on add good id', async () => {
  await supertest(server)
    .post('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/4d40647d-6691-4b8f-bec4-b93831e28e17')
    .expect(201)
});

it('returns correct item on good add', async () => {
  await supertest(server)
    .delete('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/4d40647d-6691-4b8f-bec4-b93831e28e17')
  await supertest(server)
    .post('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/4d40647d-6691-4b8f-bec4-b93831e28e17')
    .then((res) => {
      expect(res.body.title).toEqual('2006 Italy Home Jersey')
    });
});

it('actually adds item to wishlist on good add', async () => {
  await supertest(server)
    .delete('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/4d40647d-6691-4b8f-bec4-b93831e28e17')
  await supertest(server)
    .post('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/4d40647d-6691-4b8f-bec4-b93831e28e17')
  await supertest(server)
    .get('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f')
    .then((res) => {
      expect(res.body).toContainEqual(
        expect.objectContaining({ title: '2006 Italy Home Jersey' })
      )
    });
});

it('returns 409 on add already in', async () => {
  await supertest(server)
    .post('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/4d40647d-6691-4b8f-bec4-b93831e28e17')
  await supertest(server)
    .post('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/4d40647d-6691-4b8f-bec4-b93831e28e17')
    .expect(409)
});

it('returns 409 on add listing doesnt exist', async () => {
   await supertest(server)
    .post('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/badbadba-dbad-badb-ad51-0bbbaeafad6b')
    .expect(409)
});

it('returns 409 on add shopper doesnt exist', async () => {
   await supertest(server)
    .post('/api/v0/wishlist/badbadba-dbad-badb-ad51-0bbbaeafad6b/4d40647d-6691-4b8f-bec4-b93831e28e17')
    .expect(409)
});

it('returns 400 on badly formatted uuid', async () => {
   await supertest(server)
    .post('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/not-a-uuid')
    .expect(400)
});