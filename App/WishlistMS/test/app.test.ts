import {it} from 'vitest'
import supertest from 'supertest'
import {server} from './setup'

it('serves graphql playground', async () => {
  await supertest(server)
    .get('/playground')
    .expect(200)
})

it('returns 400 on malformed JSON body', async () => {
  await supertest(server)
    .post('/graphql')
    .set('Content-Type', 'application/json')
    .send('{bad json')
    .expect(400)
})
