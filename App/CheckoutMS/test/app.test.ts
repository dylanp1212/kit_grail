import {expect, it} from 'vitest'
import request from 'supertest'
import app from '../src/app'

it('serves swagger docs', async () => {
  const res = await request(app).get('/api/v0/docs/')
  expect(res.status).toBe(200)
})
