import {describe, expect, it, vi} from 'vitest'

import {HistorianService} from '../src/historian/service'

const ID = '5e25b4f0-2ef4-4ec0-8ae0-e97ca701eb74'

const happy = {
  summary: 'Argentina blue-and-white [1].',
  citations: [{index: 1, url: 'https://en.wikipedia.org/wiki/X', title: 'X'}],
  generated_at: '2026-06-07T23:00:03.475Z',
  cached: false,
}

describe('HistorianService.getListingHistory', () => {
  it('returns parsed body on 200', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(happy), {status: 200}),
    )
    const out = await new HistorianService().getListingHistory(ID)
    expect(out?.summary).toContain('blue-and-white')
    expect(out?.citations[0].url).toContain('wikipedia')
  })

  it('returns null on 404', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('', {status: 404}))
    const out = await new HistorianService().getListingHistory(ID)
    expect(out).toBeNull()
  })

  it('returns null on 503', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('', {status: 503}))
    const out = await new HistorianService().getListingHistory(ID)
    expect(out).toBeNull()
  })

  it('returns null when fetch throws (network error)', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('ECONNREFUSED'))
    const out = await new HistorianService().getListingHistory(ID)
    expect(out).toBeNull()
  })

  it('returns null when fetch rejects with an AbortError (timeout path)', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
      new DOMException('aborted', 'AbortError'),
    )
    const out = await new HistorianService().getListingHistory(ID)
    expect(out).toBeNull()
  })

  it('hits the configured URL with the encoded listing id', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(happy), {status: 200}),
    )
    await new HistorianService().getListingHistory(ID)
    const url = fetchSpy.mock.calls[0][0] as string
    expect(url).toContain(`/history/listings/${ID}`)
  })
})
