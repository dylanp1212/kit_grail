import {test, describe, expect} from 'vitest'
import supertest from 'supertest'
import {http, HttpResponse} from 'msw'
import type {Request, Response, NextFunction} from 'express'

import {server} from './setup';
import {fakeListing, mswServer} from './mswServer';
import {requireSellerAuth} from './authMock';

const LISTING_MS = 'http://localhost:3011/api/v0/kit-listing';

describe('Listings', () => {
  test('User can see their listings', async () => {
    await supertest(server)
      .get('/api/v0/my-listings/all')
      .expect(200);
  });

  test('returns 401 when user is not set on request', async () => {
    requireSellerAuth.mockImplementationOnce(
        (_req: Request, _res: Response, next: NextFunction) => next(),
    );
    await supertest(server)
      .get('/api/v0/my-listings/all')
      .expect(401);
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

describe('Edit Listing', () => {
  const editBody = {
    title: 'Updated Shirt', description: 'New desc', size: 'medium',
    colors: ['blue'], price: 39.99, quantity: 2,
  };

  test('returns updated listing on success', async () => {
    mswServer.use(
      http.patch(`${LISTING_MS}/${fakeListing.id}`, () =>
        HttpResponse.json({...fakeListing, ...editBody}), {once: true},
      ),
    );
    const res = await supertest(server)
      .patch(`/api/v0/my-listings/${fakeListing.id}`)
      .set('Cookie', 'seller_session=test-jwe')
      .send(editBody)
      .expect(200);
    expect(res.body.title).toBe('Updated Shirt');
  });

  test('returns 400 when upstream returns 400', async () => {
    mswServer.use(
      http.patch(`${LISTING_MS}/${fakeListing.id}`, () =>
        new HttpResponse(null, {status: 400}), {once: true},
      ),
    );
    await supertest(server)
      .patch(`/api/v0/my-listings/${fakeListing.id}`)
      .set('Cookie', 'seller_session=test-jwe')
      .send(editBody)
      .expect(400);
  });

  test('returns 401 when session cookie is missing', async () => {
    await supertest(server)
      .patch(`/api/v0/my-listings/${fakeListing.id}`)
      .send(editBody)
      .expect(401);
  });
});

describe('Create Listing', () => {
  test('user can create new listing', async () => {
    await supertest(server)
      .post(`/api/v0/my-listings`)
      .set('Cookie', 'seller_session=test-jwe')
      .send({...fakeListing, listed: undefined, id: undefined})
      .expect(201);
  });

  test('gets right return on create new', async () => {
    const res = await supertest(server)
      .post(`/api/v0/my-listings`)
      .set('Cookie', 'seller_session=test-jwe')
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
      .set('Cookie', 'seller_session=test-jwe')
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
      .set('Cookie', 'seller_session=test-jwe')
      .send({...fakeListing, listed: undefined, id: undefined})
      .expect(500);
  });

  test('returns 401 when session cookie missing', async () => {
    await supertest(server)
      .post('/api/v0/my-listings')
      .send({...fakeListing, listed: undefined, id: undefined})
      .expect(401);
  });

  test('seller field in body is overridden by session id', async () => {
    let receivedBody: {seller?: string} = {};
    let receivedAuth: string | null = null;
    mswServer.use(
      http.post(LISTING_MS, async ({request}) => {
        receivedBody = (await request.json()) as {seller?: string};
        receivedAuth = request.headers.get('Authorization');
        return HttpResponse.json(
          {...fakeListing, seller: receivedBody.seller},
          {status: 201},
        );
      }),
    );
    await supertest(server)
      .post('/api/v0/my-listings')
      .set('Cookie', 'seller_session=test-jwe')
      .send({
        ...fakeListing,
        listed: undefined,
        id: undefined,
        seller: 'evil-other-seller-id',
      })
      .expect(201);
    expect(receivedBody.seller).toBe('test-seller-id');
    expect(receivedAuth).toBe('Bearer test-jwe');
  });

})
