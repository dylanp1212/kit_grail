import {pool} from './db'

export interface RetrievedChunk {
  id: string
  source_id: string
  source_url: string
  source_title: string
  ordinal: number
  text: string
  distance: number
}

export async function retrieveTopK(
  queryEmbedding: number[],
  k = 8,
): Promise<RetrievedChunk[]> {
  const res = await pool.query<{
    id: string
    source_id: string
    source_url: string
    source_title: string
    ordinal: number
    text: string
    distance: number
  }>(
    `SELECT
       c.id,
       c.source_id,
       s.url   AS source_url,
       s.title AS source_title,
       c.ordinal,
       c.text,
       c.embedding <=> $1::vector AS distance
     FROM kithistory.chunk c
     JOIN kithistory.source s ON s.id = c.source_id
     ORDER BY c.embedding <=> $1::vector
     LIMIT $2`,
    [`[${queryEmbedding.join(',')}]`, k],
  )
  return res.rows
}
