import {test, describe, vi, beforeEach, type Mock, expect} from 'vitest'
import supertest from 'supertest'

vi.mock('../src/db', () => ({
  pool: {
    query: vi.fn()
  }
}));


import {server} from './setup';
import { pool } from '../src/db';

const mockedQuery = pool.query as Mock;

describe('Listings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('User can see their listings', async () => {
    mockedQuery.mockResolvedValue({ rows: [] });
    await supertest(server)
      .get('/api/v0/my-listings')
      .expect(200)
  });

  test('Incorrect api route not found', async () => {
    await supertest(server)
      .get('/api/v0/non-existent')
      .expect(404)
  })

  test('Returned data is correct', async () => {
    const fakeRow = [
      {
        id: 'listing-1',
        seller: '1830b53f-b49a-47eb-9a0e-d133a2bf5c3a',
        data: {
          title: 'Vintage Tee',
          description: 'A classic',
          size: 'M',
          colors: ['red', 'white'],
          listed: true,
          price: 25,
          image: 'https://example.com/tee.jpg',
        }
      }
    ];

    (pool.query as Mock).mockResolvedValue({ rows: fakeRow });

    const res = await supertest(server).get('/api/v0/my-listings');
    console.log('res:', res.body)
    expect(res.body[0].title).toBe('Vintage Tee')
  })

})