import {it, expect} from 'vitest'
import supertest from 'supertest'
import {server} from './setup';

const testListing = {
  seller: '1830b53f-b49a-47eb-9a0e-d133a2bf5c3a',
  title: 'Test Jersey',
  description: 'This is a test Jersey',
  size: 'large',
  colors: ['blue', 'white'],
  price: 154,
}

it('returns 201 on good create new', async () => {
  await supertest(server)
    .post('/api/v0/kit-listing')
    .send({...testListing, title: 'Test Jersey 1'})
    .expect(201)
});

it('returns the right listing on good create new', async () => {
  await supertest(server)
    .post('/api/v0/kit-listing')
    .send({...testListing, title: 'Test Jersey 2'})
    .then((res) => {
      expect(res.body.title).toEqual('Test Jersey 2')
    })
  //  await supertest(server)
  //   .get('/api/v0/kit-listing')
  //   .then((res) => {
  //     console.log(res.body)
  //   })
});

it('returns a listed date on good create new', async () => {
  await supertest(server)
    .post('/api/v0/kit-listing')
    .send({...testListing, title: 'Test Jersey 3'})
    .then((res) => {
      expect(res.body.listed).not.toBeNull()
    })
});

it('returns an id on good create new', async () => {
  await supertest(server)
    .post('/api/v0/kit-listing')
    .send({...testListing, title: 'Test Jersey 4'})
    .then((res) => {
      expect(res.body.id).not.toBeNull()
    })
});

it('has listing in sellers listings now', async () => {
  await supertest(server)
    .post('/api/v0/kit-listing')
    .send({...testListing, title: 'Test Jersey 5'})
   await supertest(server)
    .get('/api/v0/kit-listing?sellerId=1830b53f-b49a-47eb-9a0e-d133a2bf5c3a')
    .then((res) => {
      expect(res.body).toContainEqual(
        expect.objectContaining({ title: 'Test Jersey 5' })
      )
    })
});

it('returns 400 on bad seller id', async () => {
  await supertest(server)
    .post('/api/v0/kit-listing')
    .send({...testListing, seller: 'not-a-uuid'})
    .expect(400)
});