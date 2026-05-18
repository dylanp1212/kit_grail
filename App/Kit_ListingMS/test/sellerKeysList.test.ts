import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { mockSession } from './sessionMock'
import { createTestSeller, deleteTestSeller, TestSeller } from './sellerFixture'
import { server } from './setup'

let other: TestSeller
let seller: TestSeller

beforeEach(async () => {
  seller = await createTestSeller('key-list@kg.test', 'Key Lister')
  other = await createTestSeller('key-other@kg.test', 'Other')
})

afterEach(async () => {
  vi.restoreAllMocks()
  await deleteTestSeller(seller.id)
  await deleteTestSeller(other.id)
})

interface KeyResponse {
  id: string
  prefix: string
  label?: string
  created_at?: string
  revoked_at?: string
  plaintext?: string
  hash?: string
}

describe('GET /api/v0/seller/keys', () => {
  it('returns 401 without an Authorization header', async () => {
    await supertest(server).get('/api/v0/seller/keys').expect(401)
  })

  it('returns only the authenticated seller\'s keys', async () => {
    mockSession(seller.id)
    await supertest(server)
      .post('/api/v0/seller/keys')
      .set('Authorization', 'Bearer jwe-token')
      .send({ label: 'Mine A' })
    await supertest(server)
      .post('/api/v0/seller/keys')
      .set('Authorization', 'Bearer jwe-token')
      .send({ label: 'Mine B' })

    vi.restoreAllMocks()
    mockSession(other.id)
    await supertest(server)
      .post('/api/v0/seller/keys')
      .set('Authorization', 'Bearer jwe-token')
      .send({ label: 'Other' })

    vi.restoreAllMocks()
    mockSession(seller.id)
    const res = await supertest(server)
      .get('/api/v0/seller/keys')
      .set('Authorization', 'Bearer jwe-token')
      .expect(200)

    const labels = (res.body as KeyResponse[]).map((k) => k.label).filter(Boolean)
    expect(labels).toContain('Mine A')
    expect(labels).toContain('Mine B')
    expect(labels).not.toContain('Other')
  })

  it('omits hash and plaintext from each row', async () => {
    mockSession(seller.id)
    await supertest(server)
      .post('/api/v0/seller/keys')
      .set('Authorization', 'Bearer jwe-token')
      .send({ label: 'NoSecret' })

    const res = await supertest(server)
      .get('/api/v0/seller/keys')
      .set('Authorization', 'Bearer jwe-token')
      .expect(200)

    for (const k of res.body as KeyResponse[]) {
      expect(k.hash).toBeUndefined()
      expect(k.plaintext).toBeUndefined()
    }
  })
})
