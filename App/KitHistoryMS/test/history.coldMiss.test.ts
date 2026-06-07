import {afterAll, afterEach, beforeEach, describe, expect, it} from 'vitest'
import request from 'supertest'

import app from '../src/app'
import {pool} from '../src/db'

const SOURCE_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
const LISTING_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'

function vec(activeDim: number): string {
  const v = new Array(768).fill(0)
  v[activeDim] = 1
  return `[${v.join(',')}]`
}

async function seedCorpus() {
  await pool.query(
    `INSERT INTO kithistory.source (id, url, title)
     VALUES ($1, 'https://en.wikipedia.org/2002_UCL_Final', '2002 UEFA Champions League Final')`,
    [SOURCE_ID],
  )
  await pool.query(
    `INSERT INTO kithistory.chunk (source_id, ordinal, text, embedding)
     VALUES
       ($1, 0, 'Real Madrid won the 2002 UCL Final, beating Bayer Leverkusen 2-1 in Glasgow.', $2::vector),
       ($1, 1, 'Zidane scored the winning goal — a left-footed volley.', $3::vector)`,
    [SOURCE_ID, vec(0), vec(1)],
  )
}

function mockKitListingMs(reply: unknown, status = 200) {
  const realFetch = globalThis.fetch
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : (input as URL).toString()
    if (url.includes('/api/v0/kit-listing/')) {
      return new Response(JSON.stringify(reply), {
        status,
        headers: {'Content-Type': 'application/json'},
      })
    }
    return realFetch(input, init)
  }) as typeof fetch
  return () => {
    globalThis.fetch = realFetch
  }
}

beforeEach(async () => {
  delete process.env.GEMINI_API_KEY
  await pool.query('DELETE FROM kithistory.listing_history')
  await pool.query('DELETE FROM kithistory.chunk')
  await pool.query('DELETE FROM kithistory.source')
})

afterEach(async () => {
  await pool.query('DELETE FROM kithistory.listing_history')
  await pool.query('DELETE FROM kithistory.chunk')
  await pool.query('DELETE FROM kithistory.source')
})

afterAll(async () => {
  await pool.end()
})

describe('GET /api/v0/history/listings/{id} (cold miss path)', () => {
  it('returns 404 when Kit_ListingMS does not know the listing', async () => {
    const restore = mockKitListingMs({}, 404)
    try {
      await seedCorpus()
      await request(app).get(`/api/v0/history/listings/${LISTING_ID}`).expect(404)
    } finally {
      restore()
    }
  })

  it('returns 404 when the corpus is empty (nothing to retrieve)', async () => {
    const restore = mockKitListingMs({
      id: LISTING_ID,
      seller: 'seller-id',
      title: 'Test Jersey',
      description: 'A test.',
    })
    try {
      await request(app).get(`/api/v0/history/listings/${LISTING_ID}`).expect(404)
    } finally {
      restore()
    }
  })

  it('cold-miss: fetches, retrieves, generates (stubbed), validates, caches, returns 200', async () => {
    const restore = mockKitListingMs({
      id: LISTING_ID,
      seller: 'seller-id',
      title: 'Zidane 2002 Real Madrid Jersey',
      description: 'Worn in the 2002 UCL Final.',
    })
    try {
      await seedCorpus()
      const res = await request(app)
        .get(`/api/v0/history/listings/${LISTING_ID}`)
        .expect(200)

      expect(res.body.summary).toContain('[1]')
      expect(res.body.cached).toBe(false)
      expect(res.body.citations).toHaveLength(1)
      expect(res.body.citations[0].url).toBe('https://en.wikipedia.org/2002_UCL_Final')
      expect(res.body.citations[0].title).toBe('2002 UEFA Champions League Final')

      // Cache row was written.
      const cached = await pool.query<{summary: string}>(
        `SELECT summary FROM kithistory.listing_history WHERE listing_id = $1`,
        [LISTING_ID],
      )
      expect(cached.rowCount).toBe(1)
    } finally {
      restore()
    }
  })

  it('second call hits the cache (cached=true) and does NOT re-call the listing service', async () => {
    let listingCalls = 0
    const realFetch = globalThis.fetch
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : (input as URL).toString()
      if (url.includes('/api/v0/kit-listing/')) {
        listingCalls++
        return new Response(
          JSON.stringify({
            id: LISTING_ID,
            seller: 'seller-id',
            title: 'Z Jersey',
            description: 'd',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}},
        )
      }
      return realFetch(input, init)
    }) as typeof fetch
    try {
      await seedCorpus()
      await request(app).get(`/api/v0/history/listings/${LISTING_ID}`).expect(200)
      const second = await request(app)
        .get(`/api/v0/history/listings/${LISTING_ID}`)
        .expect(200)
      expect(second.body.cached).toBe(true)
      expect(listingCalls).toBe(1)
    } finally {
      globalThis.fetch = realFetch
    }
  })
})
