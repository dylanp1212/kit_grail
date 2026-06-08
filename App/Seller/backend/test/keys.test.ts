import {test, describe, expect} from 'vitest'
import supertest from 'supertest'
import {http, HttpResponse} from 'msw'

import {server} from './setup'
import {mswServer} from './mswServer'

const KEYS_MS = 'http://localhost:3011/api/v0/seller/keys'
const JWE = 'test-jwe-token'

describe('GET /api/v0/keys', () => {
  test('returns 401 without session cookie', async () => {
    await supertest(server)
      .get('/api/v0/keys')
      .expect(401)
  })

  test('forwards JWE to Kit_ListingMS as Bearer', async () => {
    let receivedAuth: string | null = null
    mswServer.use(
      http.get(KEYS_MS, ({request}) => {
        receivedAuth = request.headers.get('Authorization')
        return HttpResponse.json([])
      }),
    )
    await supertest(server)
      .get('/api/v0/keys')
      .set('Cookie', `seller_session=${JWE}`)
      .expect(200)
    expect(receivedAuth).toBe(`Bearer ${JWE}`)
  })

  test('propagates error when upstream returns non-ok', async () => {
    mswServer.use(
      http.get(KEYS_MS, () => new HttpResponse(null, {status: 500}), {once: true}),
    )
    const res = await supertest(server)
      .get('/api/v0/keys')
      .set('Cookie', `seller_session=${JWE}`)
    expect(res.body.message).toBeUndefined()
  })

  test('passes through the response body', async () => {
    mswServer.use(
      http.get(KEYS_MS, () =>
        HttpResponse.json([{id: 'k1', prefix: 'kg_abcdefghij', label: 'Prod'}]),
      ),
    )
    const res = await supertest(server)
      .get('/api/v0/keys')
      .set('Cookie', `seller_session=${JWE}`)
      .expect(200)
    expect(res.body[0].label).toBe('Prod')
  })
})

describe('POST /api/v0/keys', () => {
  test('returns 401 without session cookie', async () => {
    await supertest(server)
      .post('/api/v0/keys')
      .send({label: 'Prod'})
      .expect(401)
  })

  test('propagates error when upstream returns non-ok', async () => {
    mswServer.use(
      http.post(KEYS_MS, () => new HttpResponse(null, {status: 500}), {once: true}),
    )
    const res = await supertest(server)
      .post('/api/v0/keys')
      .set('Cookie', `seller_session=${JWE}`)
      .send({label: 'Prod'})
    expect(res.body.message).toBeUndefined()
  })

  test('returns 201 with plaintext on success', async () => {
    mswServer.use(
      http.post(KEYS_MS, async ({request}) => {
        const body = (await request.json()) as {label: string}
        return HttpResponse.json(
          {
            id: 'new-id',
            prefix: 'kg_abcdefghij',
            plaintext: 'kg_secret',
            label: body.label,
            created_at: '2026-05-18T00:00:00Z',
          },
          {status: 201},
        )
      }),
    )
    const res = await supertest(server)
      .post('/api/v0/keys')
      .set('Cookie', `seller_session=${JWE}`)
      .send({label: 'Prod'})
      .expect(201)
    expect(res.body.plaintext).toBe('kg_secret')
    expect(res.body.label).toBe('Prod')
  })
})

describe('DELETE /api/v0/keys/{id}', () => {
  const VALID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'

  test('returns 401 without session cookie', async () => {
    await supertest(server)
      .delete(`/api/v0/keys/${VALID}`)
      .expect(401)
  })

  test('returns 400 for malformed UUID', async () => {
    await supertest(server)
      .delete('/api/v0/keys/not-a-uuid')
      .set('Cookie', `seller_session=${JWE}`)
      .expect(400)
  })

  test('returns 204 when MS returns 204', async () => {
    mswServer.use(
      http.delete(`${KEYS_MS}/:id`, () => new HttpResponse(null, {status: 204})),
    )
    await supertest(server)
      .delete(`/api/v0/keys/${VALID}`)
      .set('Cookie', `seller_session=${JWE}`)
      .expect(204)
  })

  test('returns 404 when MS returns 404', async () => {
    mswServer.use(
      http.delete(`${KEYS_MS}/:id`, () => new HttpResponse(null, {status: 404})),
    )
    await supertest(server)
      .delete(`/api/v0/keys/${VALID}`)
      .set('Cookie', `seller_session=${JWE}`)
      .expect(404)
  })
})
