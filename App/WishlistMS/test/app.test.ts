import {it} from 'vitest'
import supertest from 'supertest'
import {server} from './setup'

it('serves swagger docs', async () => {
  await supertest(server)
    .get('/api/v0/docs/')
    .expect(200)
});

it('error handler returns 400 on malformed JSON body', async () => {
  await supertest(server)
    .post('/api/v0/wishlist')
    .set('Content-Type', 'application/json')
    .send('{bad json')
    .expect(400)
});