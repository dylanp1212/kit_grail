import {test, describe, expect} from 'vitest'
import supertest from 'supertest'
import {http, HttpResponse} from 'msw'

import {server} from './setup';
import {fakeListing, mswServer} from './mswServer';

const LISTING_MS = 'http://localhost:3011/api/v0/kit-listing';

describe('Listings', () => {
  test('User can see their listings', async () => {
    await supertest(server)
      .get('/api/v0/my-listings/all')
      .expect(200);
  });

  test('Incorrect api route not found', async () => {
    await supertest(server)
      .get('/api/v0/non-existent')
      .expect(404);
  });

  test('Returned data is correct', async () => {
    const res = await supertest(server)
      .get('/api/v0/my-listings/all');
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

  test('client-supplied userID query is ignored (uses session id)', async () => {
    let receivedSellerId: string | null = null;
    mswServer.use(
      http.get(LISTING_MS, ({request}) => {
        receivedSellerId = new URL(request.url).searchParams.get('sellerId');
        return HttpResponse.json([]);
      }),
    );
    await supertest(server)
      .get('/api/v0/my-listings/all?userID=evil-other-seller-id')
      .expect(200);
    expect(receivedSellerId).toBe('test-seller-id');
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

  test('seller field in body is overridden by session id', async () => {
    let receivedBody: {seller?: string} = {};
    mswServer.use(
      http.post(LISTING_MS, async ({request}) => {
        receivedBody = (await request.json()) as {seller?: string};
        return HttpResponse.json(
          {...fakeListing, seller: receivedBody.seller},
          {status: 201},
        );
      }),
    );
    await supertest(server)
      .post('/api/v0/my-listings')
      .send({
        ...fakeListing,
        listed: undefined,
        id: undefined,
        seller: 'evil-other-seller-id',
      })
      .expect(201);
    expect(receivedBody.seller).toBe('test-seller-id');
  });

})
