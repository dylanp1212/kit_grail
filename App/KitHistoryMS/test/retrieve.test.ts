import {afterAll, afterEach, beforeEach, describe, expect, it} from 'vitest'

import {pool} from '../src/db'
import {retrieveTopK} from '../src/retrieve'

const SRC_A = '11111111-1111-1111-1111-111111111111'
const SRC_B = '22222222-2222-2222-2222-222222222222'

function unitVec(activeDim: number): number[] {
  const v = new Array<number>(768).fill(0)
  v[activeDim] = 1
  return v
}

async function insertSource(id: string, url: string, title: string) {
  await pool.query(
    `INSERT INTO kithistory.source (id, url, title) VALUES ($1, $2, $3)`,
    [id, url, title],
  )
}

async function insertChunk(
  sourceId: string,
  ordinal: number,
  text: string,
  embedding: number[],
) {
  await pool.query(
    `INSERT INTO kithistory.chunk (source_id, ordinal, text, embedding)
     VALUES ($1, $2, $3, $4::vector)`,
    [sourceId, ordinal, text, `[${embedding.join(',')}]`],
  )
}

beforeEach(async () => {
  await pool.query('DELETE FROM kithistory.chunk')
  await pool.query('DELETE FROM kithistory.source')
})

afterEach(async () => {
  await pool.query('DELETE FROM kithistory.chunk')
  await pool.query('DELETE FROM kithistory.source')
})

afterAll(async () => {
  await pool.end()
})

describe('retrieveTopK', () => {
  it('returns the closest chunk first by cosine distance', async () => {
    await insertSource(SRC_A, 'https://en.wikipedia.org/A', 'Source A')
    await insertChunk(SRC_A, 0, 'closer chunk', unitVec(0))
    await insertChunk(SRC_A, 1, 'further chunk', unitVec(1))

    const out = await retrieveTopK(unitVec(0), 2)
    expect(out).toHaveLength(2)
    expect(out[0].text).toBe('closer chunk')
    expect(out[0].distance).toBeLessThan(0.01)
    expect(out[1].text).toBe('further chunk')
    expect(out[1].distance).toBeGreaterThan(out[0].distance)
  })

  it('respects the k limit', async () => {
    await insertSource(SRC_A, 'https://en.wikipedia.org/A', 'Source A')
    for (let i = 0; i < 5; i++) {
      await insertChunk(SRC_A, i, `chunk ${i}`, unitVec(i))
    }
    const out = await retrieveTopK(unitVec(0), 3)
    expect(out).toHaveLength(3)
  })

  it('joins through to source metadata (url, title)', async () => {
    await insertSource(SRC_A, 'https://en.wikipedia.org/Zidane', 'Zinedine Zidane')
    await insertChunk(SRC_A, 0, 'about Zidane', unitVec(0))

    const [first] = await retrieveTopK(unitVec(0), 1)
    expect(first.source_url).toBe('https://en.wikipedia.org/Zidane')
    expect(first.source_title).toBe('Zinedine Zidane')
  })

  it('returns chunks from multiple sources', async () => {
    await insertSource(SRC_A, 'https://A', 'A')
    await insertSource(SRC_B, 'https://B', 'B')
    await insertChunk(SRC_A, 0, 'from A', unitVec(0))
    await insertChunk(SRC_B, 0, 'from B', unitVec(1))

    const out = await retrieveTopK(unitVec(0), 2)
    expect(out.map((c) => c.source_url).sort()).toEqual(['https://A', 'https://B'])
  })

  it('returns empty array when there are no chunks', async () => {
    const out = await retrieveTopK(unitVec(0), 5)
    expect(out).toEqual([])
  })
})
