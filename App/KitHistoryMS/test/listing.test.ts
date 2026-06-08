import {describe, expect, it, vi} from 'vitest'

import {fetchListing, retrievalQuery} from '../src/listing'

describe('retrievalQuery', () => {
  it('prefers structured fields when present', () => {
    const out = retrievalQuery({
      id: 'x', seller: 'y',
      title: 'noisy listing title',
      description: 'free-text noise',
      player: 'Zidane', club: 'Real Madrid',
      season: '2001-02', competition: 'UCL',
    })
    expect(out).toBe('Zidane Real Madrid 2001-02 UCL')
  })

  it('uses any subset of structured fields that are present', () => {
    const out = retrievalQuery({
      id: 'x', seller: 'y',
      title: 't', description: 'd',
      player: 'Pelé',
      competition: 'World Cup',
    })
    expect(out).toBe('Pelé World Cup')
  })

  it('falls back to title + truncated description when no structured fields', () => {
    const out = retrievalQuery({
      id: 'x', seller: 'y',
      title: 'Random Jersey',
      description: 'A'.repeat(500),
    })
    expect(out.startsWith('Random Jersey. AAAAAAAAA')).toBe(true)
    // description is truncated to 300 chars
    expect(out.length).toBeLessThan(320)
  })

  it('ignores empty-string structured fields (treats them as missing)', () => {
    const out = retrievalQuery({
      id: 'x', seller: 'y',
      title: 'fallback', description: 'desc',
      player: '', club: '', season: '', competition: '',
    })
    expect(out.startsWith('fallback. desc')).toBe(true)
  })
})

describe('fetchListing', () => {
  it('returns parsed body on 200', async () => {
    const fetchFn = vi.fn(async () =>
      new Response(JSON.stringify({id: 'x', seller: 's', title: 't', description: 'd'}), {status: 200}),
    )
    const out = await fetchListing('x', fetchFn as unknown as typeof fetch)
    expect(out?.title).toBe('t')
  })

  it('returns null on 404', async () => {
    const fetchFn = vi.fn(async () => new Response('', {status: 404}))
    const out = await fetchListing('missing', fetchFn as unknown as typeof fetch)
    expect(out).toBeNull()
  })

  it('throws on other non-2xx', async () => {
    const fetchFn = vi.fn(async () => new Response('', {status: 500}))
    await expect(
      fetchListing('x', fetchFn as unknown as typeof fetch),
    ).rejects.toThrow(/fetchListing failed: 500/)
  })

  // jscpd threshold is 0 — keep the two URL tests structurally distinct.
  const callAndReadUrl = async () => {
    const fetchFn = vi.fn(async () =>
      new Response(JSON.stringify({id: 'x'}), {status: 200}))
    await fetchListing('abc', fetchFn as unknown as typeof fetch)
    return fetchFn.mock.calls[0][0] as string
  }

  it('hits the configured KIT_LISTING_MS_URL', async () => {
    expect(await callAndReadUrl()).toContain('/kit-listing/abc')
  })

  it('falls back to the default URL when KIT_LISTING_MS_URL is unset', async () => {
    const saved = process.env.KIT_LISTING_MS_URL
    delete process.env.KIT_LISTING_MS_URL
    try {
      expect(await callAndReadUrl())
        .toBe('http://localhost:3011/api/v0/kit-listing/abc')
    } finally {
      if (saved !== undefined) process.env.KIT_LISTING_MS_URL = saved
    }
  })
})
