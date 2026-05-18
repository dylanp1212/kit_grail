import {test, describe, expect} from 'vitest'
import supertest from 'supertest'
import {http, HttpResponse} from 'msw'

import {server} from './setup';
import {fakeListing, mswServer} from './mswServer';

const userID = 'fake-seller-id';
const LISTING_MS = 'http://localhost:3011/api/v0/kit-listing';

describe('Listings', () => {
  test('User can see their listings', async () => {
    await supertest(server)
      .get(`/api/v0/my-listings/all?userID=${userID}`)
      .expect(200);
  });

  test('Incorrect api route not found', async () => {
    await supertest(server)
      .get('/api/v0/non-existent')
      .expect(404);
  });

  test('Returned data is correct', async () => {
    const res = await supertest(server)
      .get(`/api/v0/my-listings/all?userID=${userID}`);
    expect(res.body[0].title).toBe(fakeListing.title);
  });

  test('Listing by ID correctly returned', async () => {
    const res = await supertest(server)
      .get(`/api/v0/my-listings/${fakeListing.id}`);
    expect(res.body.title).toBe(fakeListing.title);
  });

  test('Listing by non-existent ID not found', async () => {
    await supertest(server)
      .get('/api/v0/my-listings/nonexistent')
      .expect(404);
  });

  test('getListing returns 500 when MS throws', async () => {
    mswServer.use(
      http.get(`${LISTING_MS}/:id`, () =>
        HttpResponse.error(), {once: true},
      ),
    );
    await supertest(server)
      .get(`/api/v0/my-listings/${fakeListing.id}`)
      .expect(500);
  });

  test('get listings no userID', async () => {
    await supertest(server)
      .get(`/api/v0/my-listings/all`)
      .expect(400);
  });
});

describe('Create Listing', () => {
  test('user can create new listing', async () => {
    await supertest(server)
      .post(`/api/v0/my-listings`)
      .send({...fakeListing, listed: undefined, id: undefined})
      .expect(201);
  });

  test('gets right return on create new', async () => {
    const res = await supertest(server)
      .post(`/api/v0/my-listings`)
      .send({...fakeListing, listed: undefined, id: undefined})
    expect(res.body.title).toBe(fakeListing.title);
  });

  test('returns undefined on 400', async () => {
    mswServer.use(
      http.post(`${LISTING_MS}`, () =>
        new HttpResponse(null, {status: 400}), {once: true},
      ),
    );
    await supertest(server)
      .post('/api/v0/my-listings')
      .send({...fakeListing, listed: undefined, id: undefined})
      .expect(400);
  });

  test('createNewListing returns 500 when MS throws', async () => {
    mswServer.use(
      http.post(`${LISTING_MS}`, () =>
        HttpResponse.error(), {once: true},
      ),
    );
    await supertest(server)
      .post('/api/v0/my-listings')
      .send({...fakeListing, listed: undefined, id: undefined})
      .expect(500);
  });

})