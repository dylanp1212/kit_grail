import {it, expect} from 'vitest'
import supertest from 'supertest'
import {server} from './setup'

it('returns 200 on good remove', async () => {
  await supertest(server)
    .post('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/4d40647d-6691-4b8f-bec4-b93831e28e17')
  await supertest(server)
    .delete('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/4d40647d-6691-4b8f-bec4-b93831e28e17')
    .expect(200)
});

it('returns correct id on good remove', async () => {
  await supertest(server)
    .post('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/4d40647d-6691-4b8f-bec4-b93831e28e17')
  await supertest(server)
    .delete('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/4d40647d-6691-4b8f-bec4-b93831e28e17')
    .then((res) => {
      // console.log(res.text)
      expect(res.text).toEqual('4d40647d-6691-4b8f-bec4-b93831e28e17')
    });
});

it('actually removes from list on good remove', async () => {
  await supertest(server)
    .post('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/4d40647d-6691-4b8f-bec4-b93831e28e17')
  await supertest(server)
    .delete('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/4d40647d-6691-4b8f-bec4-b93831e28e17')
  await supertest(server)
    .get('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f')
    .then((res) => {
      expect(res.body).not.toContainEqual(
        expect.objectContaining({ title: '2006 Italy Home Jersey' })
      )
    });
});

it('returns 400 on remove bad id', async () => {
  await supertest(server)
    .delete('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f/not-a-uuid')
    .expect(400)
});