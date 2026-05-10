import {it, expect} from 'vitest'
import supertest from 'supertest'
import {server} from './setup'

it('returns 200 on good check', async () => {
  await supertest(server)
    .get('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/4d40647d-6691-4b8f-bec4-b93831e28e17')
    .expect(200)
});

it('returns true on check when item in list', async () => {
  await supertest(server)
    .post('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/4d40647d-6691-4b8f-bec4-b93831e28e17')
  await supertest(server)
    .get('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/4d40647d-6691-4b8f-bec4-b93831e28e17')
    .then((res) => {
      expect(res.body).toEqual(true)
    });
});

it('returns false on check when item not in list', async () => {
  await supertest(server)
    .delete('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/4d40647d-6691-4b8f-bec4-b93831e28e17')
  await supertest(server)
    .get('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/4d40647d-6691-4b8f-bec4-b93831e28e17')
    .then((res) => {
      expect(res.body).toEqual(false)
    });
});

it('returns 400 on bad uuid', async () => {
  await supertest(server)
    .get('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/not-a-uuid')
    .expect(400)
});