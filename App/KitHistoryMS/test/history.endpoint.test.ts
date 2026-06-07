import {afterAll, afterEach, beforeEach, describe, expect, it} from 'vitest'
import request from 'supertest'

import app from '../src/app'
import {pool} from '../src/db'

const LISTING_ID = '11111111-1111-1111-1111-111111111111'
const OTHER_ID = '22222222-2222-2222-2222-222222222222'

const sampleCitations = [
  {index: 1, url: 'https://en.wikipedia.org/wiki/2002_UEFA_Champions_League_Final', title: '2002 UCL Final'},
  {index: 2, url: 'https://en.wikipedia.org/wiki/Zinedine_Zidane', title: 'Zinedine Zidane'},
]

beforeEach(async () => {
  await pool.query('DELETE FROM kithistory.listing_history')
})

afterEach(async () => {
  await pool.query('DELETE FROM kithistory.listing_history')
})

afterAll(async () => {
  await pool.end()
})

describe('GET /api/v0/history/listings/{id} (cache hit path)', () => {
  it('returns 400 for a malformed listing id', async () => {
    await request(app).get('/api/v0/history/listings/not-a-uuid').expect(400)
  })

  it('returns 200 + cached body when a row exists', async () => {
    await pool.query(
      `INSERT INTO kithistory.listing_history
        (listing_id, content_hash, entities, summary, citations)
       VALUES ($1, 'hash', '{}'::jsonb, $2, $3::jsonb)`,
      [
        LISTING_ID,
        'Zidane wore this kit during the 2001-02 season [1][2].',
        JSON.stringify(sampleCitations),
      ],
    )

    const res = await request(app)
      .get(`/api/v0/history/listings/${LISTING_ID}`)
      .expect(200)

    expect(res.body.summary).toContain('Zidane')
    expect(res.body.citations).toHaveLength(2)
    expect(res.body.citations[0].url).toContain('Champions_League_Final')
    expect(res.body.cached).toBe(true)
    expect(typeof res.body.generated_at).toBe('string')
  })

  it('only returns the requested listing\'s row', async () => {
    await pool.query(
      `INSERT INTO kithistory.listing_history
        (listing_id, content_hash, entities, summary, citations)
       VALUES
        ($1, 'h1', '{}'::jsonb, 'mine', '[]'::jsonb),
        ($2, 'h2', '{}'::jsonb, 'theirs', '[]'::jsonb)`,
      [LISTING_ID, OTHER_ID],
    )

    const res = await request(app)
      .get(`/api/v0/history/listings/${LISTING_ID}`)
      .expect(200)
    expect(res.body.summary).toBe('mine')
  })
})
