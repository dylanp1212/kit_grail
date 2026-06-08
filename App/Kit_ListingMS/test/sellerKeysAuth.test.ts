import { afterEach, describe, it, vi } from 'vitest'
import supertest from 'supertest'

import { server } from './setup'
import { JweAuthService } from '../src/auth/jwe'

const SOME_UUID = '11111111-1111-1111-1111-111111111111'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('seller keys controller returns 401 when sellerId is empty', () => {
  it('POST returns 401', async () => {
    vi.spyOn(JweAuthService.prototype, 'lookup').mockResolvedValue({ id: '' })
    await supertest(server)
      .post('/api/v0/seller/keys')
      .set('Authorization', 'Bearer fake-jwe-token')
      .send({ label: 'test' })
      .expect(401)
  })

  it('GET returns 401', async () => {
    vi.spyOn(JweAuthService.prototype, 'lookup').mockResolvedValue({ id: '' })
    await supertest(server)
      .get('/api/v0/seller/keys')
      .set('Authorization', 'Bearer fake-jwe-token')
      .expect(401)
  })

  it('DELETE returns 401', async () => {
    vi.spyOn(JweAuthService.prototype, 'lookup').mockResolvedValue({ id: '' })
    await supertest(server)
      .delete(`/api/v0/seller/keys/${SOME_UUID}`)
      .set('Authorization', 'Bearer fake-jwe-token')
      .expect(401)
  })
})
