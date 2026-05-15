import { describe, it, expect } from 'vitest'

import { generateKey, getPrefix, hashKey, verifyKey } from '../src/auth/apiKey'

describe('apiKey helpers', () => {
  it('generateKey returns a key starting with kg_', () => {
    const k = generateKey()
    expect(k.startsWith('kg_')).toBe(true)
    expect(k.length).toBeGreaterThanOrEqual(40)
  })

  it('generateKey returns different keys on each call', () => {
    const a = generateKey()
    const b = generateKey()
    expect(a).not.toBe(b)
  })

  it('getPrefix returns the first 12 characters', () => {
    const k = generateKey()
    expect(getPrefix(k)).toBe(k.slice(0, 12))
    expect(getPrefix(k).length).toBe(12)
  })

  it('hashKey + verifyKey round-trip succeeds', async () => {
    const k = generateKey()
    const h = await hashKey(k)
    expect(await verifyKey(k, h)).toBe(true)
  })

  it('verifyKey rejects a different key', async () => {
    const a = generateKey()
    const b = generateKey()
    const h = await hashKey(a)
    expect(await verifyKey(b, h)).toBe(false)
  })
})
