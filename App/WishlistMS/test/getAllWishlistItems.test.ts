import {it, expect} from 'vitest'
import supertest from 'supertest'
import {server} from './setup';

it('returns 200 on get all', async () => {
  await supertest(server)
    .get('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f')
    .expect(200)
});

it('returns correct number of listings on get all', async () => {
  await supertest(server)
    .get('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f')
    .then((res) => {
      // console.log(res.body)
      expect(res.body.length).toEqual(3)
    });
});

it('returns correct listing on good search', async () => {
  await supertest(server)
    .get('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f?search=messi')
    .then((res) => {
      expect(res.body).toContainEqual(
        expect.objectContaining({ title: '2014 Argentina Messi Jersey' })
      )
    });
});

it('doesnt return incorrect listing on good search', async () => {
  await supertest(server)
    .get('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f?search=messi')
    .then((res) => {
      expect(res.body).not.toContainEqual(
        expect.objectContaining({ title: '2006 Italy Home Jersey' })
      )
    });
});

it('return empty array on bad search', async () => {
  await supertest(server)
    .get('/api/v0/wishlist/e86405c1-545b-4bef-912c-a9b01ee6d18f?search=aafasdfasdf')
    .then((res) => {
      expect(res.body.length).toEqual(0)
    });
});

it('returns 400 on badly formatted uuid', async () => {
   await supertest(server)
   .get('/api/v0/wishlist/not-a-uuid')
    .expect(400)
});