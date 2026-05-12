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

  const fakeRow = [
    {
      id: 'fake',
      seller: '1830b53f-b49a-47eb-9a0e-d133a2bf5c3a',
      data: {
        title: 'Fake Shirt',
        description: 'Fake Description',
        size: 'F',
        colors: ['fake', 'colors'],
        listed: true,
        price: 0,
        image: 'https://example.com/tee.jpg',
      }
    }
  ];

  test('User can see their listings', async () => {
    mockedQuery.mockResolvedValue({ rows: [] });
    await supertest(server)
      .get('/api/v0/my-listings/all')
      .expect(200)
  });

  test('Incorrect api route not found', async () => {
    await supertest(server)
      .get('/api/v0/non-existent')
      .expect(404)
  })

  test('Returned data is correct', async () => {
    (pool.query as Mock).mockResolvedValue({ rows: fakeRow });

    const res = await supertest(server).get('/api/v0/my-listings/all');
    expect(res.body[0].title).toBe('Fake Shirt')
  })

  test('Listing by ID correctly returned', async () => {
    (pool.query as Mock).mockResolvedValue({ rows: fakeRow });

    const res = await supertest(server).get('/api/v0/my-listings/fake');
    expect(res.body.title).toBe('Fake Shirt')
  })

  test('Listing by non-existent ID not found', async () => {
    (pool.query as Mock).mockResolvedValue({ rows: [] });
    await supertest(server)
      .get('/api/v0/my-listings/nonexistent')
      .expect(404);
  })
})