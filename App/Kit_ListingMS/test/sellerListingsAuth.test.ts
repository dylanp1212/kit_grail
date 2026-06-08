import { afterEach, describe, it, vi } from 'vitest'
import supertest from 'supertest'

import { server } from './setup'
import { ApiKeyService } from '../src/auth/service'

const SOME_UUID = '11111111-1111-1111-1111-111111111111'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('seller listings controller returns 401 when sellerId is empty', () => {
  it('POST returns 401', async () => {
    vi.spyOn(ApiKeyService.prototype, 'lookup').mockResolvedValue({ id: '' })
    await supertest(server)
      .post('/api/v0/seller/listings')
      .set('Authorization', 'Bearer kg_fake_test_key_xxxxxxxxxxxxxxxxxxxx')
      .send({ title: 't', description: 'd', size: 'large', colors: ['red'], price: 1, quantity: 1 })
      .expect(401)
  })

  it('GET returns 401', async () => {
    vi.spyOn(ApiKeyService.prototype, 'lookup').mockResolvedValue({ id: '' })
    await supertest(server)
      .get('/api/v0/seller/listings')
      .set('Authorization', 'Bearer kg_fake_test_key_xxxxxxxxxxxxxxxxxxxx')
      .expect(401)
  })

  it('PATCH returns 401', async () => {
    vi.spyOn(ApiKeyService.prototype, 'lookup').mockResolvedValue({ id: '' })
    await supertest(server)
      .patch(`/api/v0/seller/listings/${SOME_UUID}`)
      .set('Authorization', 'Bearer kg_fake_test_key_xxxxxxxxxxxxxxxxxxxx')
      .send({ price: 2 })
      .expect(401)
  })

  it('DELETE returns 401', async () => {
    vi.spyOn(ApiKeyService.prototype, 'lookup').mockResolvedValue({ id: '' })
    await supertest(server)
      .delete(`/api/v0/seller/listings/${SOME_UUID}`)
      .set('Authorization', 'Bearer kg_fake_test_key_xxxxxxxxxxxxxxxxxxxx')
      .expect(401)
  })
})
