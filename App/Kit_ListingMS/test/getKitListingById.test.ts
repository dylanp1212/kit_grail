import {it, expect} from 'vitest'
import supertest from 'supertest'
import {server} from './setup';

it('returns 200 on get good id', async () => {
  await supertest(server)
    .get('/api/v0/kit-listing/b685a347-fe92-4e43-a551-0bbbaeafad6b')
    .expect(200)
});

it('returns correct listing on get good id', async () => {
  await supertest(server)
    .get('/api/v0/kit-listing/b685a347-fe92-4e43-a551-0bbbaeafad6b')
    .then((res) => {
      expect(res.body.title).toEqual('2012 Barcelona Home Jersey Iniesta')
    });
});

it('returns 404 on get bad id valid format', async () => {
  await supertest(server)
    .get('/api/v0/kit-listing/badbadba-dbad-badb-ad51-0bbbaeafad6b')
    .expect(404)
});

it('returns 400 on get bad id bad format', async () => {
  await supertest(server)
    .get('/api/v0/kit-listing/not-a-uuid')
    .expect(400)
});