import {describe, it, expect, afterEach, afterAll} from 'vitest'

import {pool} from '../src/db'

afterEach(async () => {
  await pool.query('DELETE FROM kithistory.listing_history')
  await pool.query('DELETE FROM kithistory.chunk')
  await pool.query('DELETE FROM kithistory.source')
})

afterAll(async () => {
  await pool.end()
})

describe('pgvector + kithistory schema', () => {
  it('vector extension is installed', async () => {
    const res = await pool.query<{extname: string}>(
      `SELECT extname FROM pg_extension WHERE extname = 'vector'`,
    )
    expect(res.rows).toHaveLength(1)
  })

  it('the three tables exist in the kithistory schema', async () => {
    const res = await pool.query<{table_name: string}>(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'kithistory' ORDER BY table_name`,
    )
    expect(res.rows.map((r) => r.table_name)).toEqual([
      'chunk',
      'listing_history',
      'source',
    ])
  })

  it('insert + cosine-distance search on a 768-dim vector round-trips', async () => {
    const source = await pool.query<{id: string}>(
      `INSERT INTO kithistory.source (url, title)
       VALUES ('https://en.wikipedia.org/wiki/Test', 'Test')
       RETURNING id`,
    )
    const sourceId = source.rows[0].id

    const vecA = Array(768).fill(0)
    vecA[0] = 1
    const vecB = Array(768).fill(0)
    vecB[1] = 1
    const vecQuery = Array(768).fill(0)
    vecQuery[0] = 1

    await pool.query(
      `INSERT INTO kithistory.chunk (source_id, ordinal, text, embedding)
       VALUES ($1, 0, 'chunk A', $2::vector),
              ($1, 1, 'chunk B', $3::vector)`,
      [sourceId, `[${vecA.join(',')}]`, `[${vecB.join(',')}]`],
    )

    const res = await pool.query<{text: string; distance: number}>(
      `SELECT text, embedding <=> $1::vector AS distance
       FROM kithistory.chunk
       ORDER BY distance
       LIMIT 1`,
      [`[${vecQuery.join(',')}]`],
    )
    expect(res.rows[0].text).toBe('chunk A')
    expect(res.rows[0].distance).toBeLessThan(0.01)
  })

  it('listing_history insert + lookup by listing_id', async () => {
    const listingId = '11111111-1111-1111-1111-111111111111'
    await pool.query(
      `INSERT INTO kithistory.listing_history
        (listing_id, content_hash, entities, summary, citations)
       VALUES ($1, 'h1', '{}'::jsonb, 's', '[]'::jsonb)`,
      [listingId],
    )
    const res = await pool.query<{summary: string}>(
      `SELECT summary FROM kithistory.listing_history WHERE listing_id = $1`,
      [listingId],
    )
    expect(res.rows[0].summary).toBe('s')
  })
})
