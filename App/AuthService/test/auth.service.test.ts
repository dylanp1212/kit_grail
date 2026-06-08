import { describe, it, expect, vi } from 'vitest'
import { EncryptJWT } from 'jose'

import { AuthService } from '../src/auth/service'
import { SessionUser } from '../src/auth'

const samplePayload: SessionUser = {
  id: 'e86405c1-545b-4bef-912c-a9b01ee6d18f',
  email: 'sally@gmail.com',
  name: 'Sally Shopper',
  role: 'shopper',
}

describe('AuthService module guard', () => {
  it('throws when SECRET env var is missing', async () => {
    const original = process.env.SECRET
    delete process.env.SECRET
    vi.resetModules()
    await expect(import('../src/auth/service')).rejects.toThrow('SECRET env var is required')
    process.env.SECRET = original
    vi.resetModules()
  })
})

describe('AuthService', () => {
  const auth = new AuthService()

  it('round-trips a session payload', async () => {
    const token = await auth.issue(samplePayload)
    const result = await auth.check(`Bearer ${token}`)
    expect(result).toEqual(samplePayload)
  })

  it('rejects when Authorization header is missing', async () => {
    await expect(auth.check(undefined)).rejects.toThrow('Unauthorized')
  })

  it('rejects when Bearer prefix is missing', async () => {
    await expect(auth.check('not-a-bearer-token')).rejects.toThrow('Unauthorized')
  })

  it('rejects a tampered token', async () => {
    const token = await auth.issue(samplePayload)
    const tampered = token.slice(0, -2) + (token.slice(-2) === 'AA' ? 'BB' : 'AA')
    await expect(auth.check(`Bearer ${tampered}`)).rejects.toThrow()
  })

  it('rejects an expired token', async () => {
    const key = new TextEncoder().encode(process.env.SECRET)
    const expired = await new EncryptJWT({ ...samplePayload })
      .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
      .setIssuedAt()
      .setExpirationTime('-1s')
      .encrypt(key)
    await expect(auth.check(`Bearer ${expired}`)).rejects.toThrow()
  })
})
