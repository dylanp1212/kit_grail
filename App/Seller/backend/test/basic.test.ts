import {test, describe, expect} from 'vitest'
import request from 'supertest';
import app from '../src/app';

describe('GET /api/v0/docs', () => {
  test('Serves the Swagger UI page', async () => {
    const res = await request(app).get('/api/v0/docs/');
    expect(res.status).toBe(200);
  })
})