import {test, describe, expect} from 'vitest'
import supertest from 'supertest'

import {server} from './setup';
import {fakeListing} from './mswServer';

const userID = 'fake-seller-id';

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

  test('get listings no userID', async () => {
    await supertest(server)
      .get(`/api/v0/my-listings/all`)
      .expect(400);
  });
});
