import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import supertest from 'supertest'

import { server } from './setup'
import { createTestSeller, deleteTestSeller, TestSeller } from './sellerFixture'
import { mockSession } from './sessionMock'

let seller: TestSeller
let other: TestSeller

interface CreatedKey {
  id: string
  plaintext: string
}

async function createKey(label: string): Promise<CreatedKey> {
  const res = await supertest(server)
    .post('/api/v0/seller/keys')
    .set('Authorization', 'Bearer jwe-token')
    .send({ label })
    .expect(201)
  return { id: res.body.id as string, plaintext: res.body.plaintext as string }
}

beforeEach(async () => {
  seller = await createTestSeller('key-revoke@kg.test', 'Key Revoker')
  other = await createTestSeller('key-revoke-other@kg.test', 'Other Revoker')
})

afterEach(async () => {
  vi.restoreAllMocks()
  await deleteTestSeller(seller.id)
  await deleteTestSeller(other.id)
})

describe('DELETE /api/v0/seller/keys/{id}', () => {
  it('returns 401 without an Authorization header', async () => {
    await supertest(server)
      .delete('/api/v0/seller/keys/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
      .expect(401)
  })

  it('returns 400 for a malformed UUID', async () => {
    mockSession(seller.id)
    await supertest(server)
      .delete('/api/v0/seller/keys/not-a-uuid')
      .set('Authorization', 'Bearer jwe-token')
      .expect(400)
  })

  it('returns 204 when revoking own key', async () => {
    mockSession(seller.id)
    const created = await createKey('ToRevoke')
    await supertest(server)
      .delete(`/api/v0/seller/keys/${created.id}`)
      .set('Authorization', 'Bearer jwe-token')
      .expect(204)
  })

  it('revoked key can no longer authenticate', async () => {
    mockSession(seller.id)
    const created = await createKey('ToRevoke')
    await supertest(server)
      .delete(`/api/v0/seller/keys/${created.id}`)
      .set('Authorization', 'Bearer jwe-token')
      .expect(204)

    vi.restoreAllMocks()
    await supertest(server)
      .get('/api/v0/seller/listings')
      .set('x-api-key', created.plaintext)
      .expect(401)
  })

  it('revoked key still appears in list with revoked_at populated', async () => {
    mockSession(seller.id)
    const created = await createKey('SoftDeleted')
    await supertest(server)
      .delete(`/api/v0/seller/keys/${created.id}`)
      .set('Authorization', 'Bearer jwe-token')
      .expect(204)

    const res = await supertest(server)
      .get('/api/v0/seller/keys')
      .set('Authorization', 'Bearer jwe-token')
      .expect(200)
    const row = (res.body as { id: string; revoked_at?: string }[]).find(
      (k) => k.id === created.id,
    )
    expect(row).toBeDefined()
    expect(row?.revoked_at).toBeTruthy()
  })

  it('returns 404 when other seller tries to revoke', async () => {
    mockSession(seller.id)
    const created = await createKey('Protected')

    vi.restoreAllMocks()
    mockSession(other.id)
    await supertest(server)
      .delete(`/api/v0/seller/keys/${created.id}`)
      .set('Authorization', 'Bearer jwe-token')
      .expect(404)
  })

  it('returns 404 for unknown key', async () => {
    mockSession(seller.id)
    await supertest(server)
      .delete('/api/v0/seller/keys/00000000-0000-0000-0000-000000000000')
      .set('Authorization', 'Bearer jwe-token')
      .expect(404)
  })
})
