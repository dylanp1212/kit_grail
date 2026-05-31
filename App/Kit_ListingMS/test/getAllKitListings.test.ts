import {it, expect} from 'vitest'
import supertest from 'supertest'
import {server} from './setup';
// import {KitListing} from '../src/kit_listing'

it('returns 200 on get all', async () => {
  await supertest(server)
    .get('/api/v0/kit-listing')
    .expect(200)
});

it('returns correct listings on get all', async () => {
  await supertest(server)
    .get('/api/v0/kit-listing')
    .then((res) => {
      // console.log(res.body)
      expect(res.body).toContainEqual(
        expect.objectContaining({ title: '2014 Argentina Messi Jersey' })
      )
    });
});

it('returns 200 on get all with search that matches', async () => {
  await supertest(server)
    .get('/api/v0/kit-listing?search=world')
    .expect(200)
});

it('returns correct listings on get all good search', async () => {
  await supertest(server)
    .get('/api/v0/kit-listing?search=world')
    .then((res) => {
      // console.log(res.body)
      expect(res.body).toContainEqual(
        expect.objectContaining({ title: '1998 Brazil Away Jersey' })
      )
    });
});

it('doesnt return wrong listing on get all good search', async () => {
  await supertest(server)
    .get('/api/v0/kit-listing?search=world')
    .then((res) => {
      expect(res.body).not.toContainEqual(
        expect.objectContaining({ title: '2012 Barcelona Home Jersey Iniesta' })
      )
    });
});

it('returns empty list on bad search', async () => {
  await supertest(server)
    .get('/api/v0/kit-listing?search=askldfjdklj')
    .then((res) => {
      expect(res.body).toEqual([])
    });
});

it('returns correct listings on get all good sellerId', async () => {
  await supertest(server)
    .get('/api/v0/kit-listing?sellerId=1830b53f-b49a-47eb-9a0e-d133a2bf5c3a')
    .then((res) => {
      expect(res.body).toContainEqual(
        expect.objectContaining({ title: '2012 Barcelona Home Jersey Iniesta' })
      )
    });
});

it('doesnt returns wrong listings on get all good sellerId', async () => {
  await supertest(server)
    .get('/api/v0/kit-listing?sellerId=1830b53f-b49a-47eb-9a0e-d133a2bf5c3a')
    .then((res) => {
      expect(res.body).not.toContainEqual(
        expect.objectContaining({ title: '1994 AC Milan Home Jersey Maldini' })
      )
    });
});

it('serves swagger docs', async () => {
  await supertest(server)
    .get('/api/v0/docs/')
    .expect(200)
});

it('error handler returns 400 on malformed JSON body', async () => {
  await supertest(server)
    .post('/api/v0/kit-listing')
    .set('Content-Type', 'application/json')
    .send('{bad json')
    .expect(400)
});

it('returns xlarge listing when sizes=xlarge', async () => {
  await supertest(server)
    .get('/api/v0/kit-listing')
    .query({ sizes: ['xlarge'] })
    .then((res) => {
      expect(res.body).toContainEqual(
        expect.objectContaining({ title: '2010 Netherlands World Cup Jersey' })
      )
    })
});

it('excludes non-xlarge listings when sizes=xlarge', async () => {
  await supertest(server)
    .get('/api/v0/kit-listing')
    .query({ sizes: ['xlarge'] })
    .then((res) => {
      expect(res.body).not.toContainEqual(
        expect.objectContaining({ title: '2014 Argentina Messi Jersey' })
      )
    })
});

it('returns listing with color purple when colors=purple', async () => {
  await supertest(server)
    .get('/api/v0/kit-listing')
    .query({ colors: ['purple'] })
    .then((res) => {
      expect(res.body).toContainEqual(
        expect.objectContaining({ title: '2016 Real Madrid Third Jersey' })
      )
    })
});

it('excludes listings without color purple when colors=purple', async () => {
  await supertest(server)
    .get('/api/v0/kit-listing')
    .query({ colors: ['purple'] })
    .then((res) => {
      expect(res.body).not.toContainEqual(
        expect.objectContaining({ title: '1994 AC Milan Home Jersey Maldini' })
      )
    })
});

it('returns matching listing when sizes=large and colors=red', async () => {
  await supertest(server)
    .get('/api/v0/kit-listing')
    .query({ sizes: ['large'], colors: ['red'] })
    .then((res) => {
      expect(res.body).toContainEqual(
        expect.objectContaining({ title: '2008 Manchester United Home Jersey Ronaldo' })
      )
    })
});

it('excludes non-matching listing when sizes=large and colors=red', async () => {
  await supertest(server)
    .get('/api/v0/kit-listing')
    .query({ sizes: ['large'], colors: ['red'] })
    .then((res) => {
      expect(res.body).not.toContainEqual(
        expect.objectContaining({ title: '2014 Argentina Messi Jersey' })
      )
    })
});
