import {createHash} from 'crypto'

import {pool} from '../db'
import {LlmClient} from '../llm'
import {ListingForRetrieval, fetchListing, retrievalQuery} from '../listing'
import {retrieveTopK} from '../retrieve'
import {assemblePrompt} from '../prompt'
import {validateCitations} from '../validate'
import {Citation, ListingHistory} from '.'

interface CachedRow {
  summary: string
  citations: Citation[]
  generated_at: Date
}

interface ServiceDeps {
  llm?: LlmClient
  fetchListingFn?: typeof fetchListing
  retrieveFn?: typeof retrieveTopK
}

export class HistoryService {
  private llm: LlmClient
  private fetchListingFn: typeof fetchListing
  private retrieveFn: typeof retrieveTopK

  constructor(deps: ServiceDeps = {}) {
    this.llm = deps.llm ?? new LlmClient()
    this.fetchListingFn = deps.fetchListingFn ?? fetchListing
    this.retrieveFn = deps.retrieveFn ?? retrieveTopK
  }

  public async getCached(listingId: string): Promise<ListingHistory | null> {
    const res = await pool.query<CachedRow>(
      `SELECT summary, citations, generated_at
       FROM kithistory.listing_history
       WHERE listing_id = $1
       LIMIT 1`,
      [listingId],
    )
    if (res.rowCount === 0) return null
    const row = res.rows[0]
    return {
      summary: row.summary,
      citations: row.citations,
      generated_at: row.generated_at.toISOString(),
      cached: true,
    }
  }

  public async generateForListing(listingId: string): Promise<ListingHistory | null> {
    const listing = await this.fetchListingFn(listingId)
    if (!listing) return null

    const query = retrievalQuery(listing)
    const queryEmbedding = await this.llm.embed(query)
    const chunks = await this.retrieveFn(queryEmbedding, 8)
    if (chunks.length === 0) return null

    const prompt = assemblePrompt({listing, chunks})
    const modelOutput = await this.llm.generate(prompt)

    const validation = validateCitations(modelOutput, chunks)
    if (!validation.ok) {
      throw new Error(`Citation validation failed: ${validation.reason ?? 'unknown'}`)
    }

    const citations: Citation[] = modelOutput.citations.map((c) => {
      const chunk = chunks[c.index - 1]
      return {index: c.index, url: chunk.source_url, title: chunk.source_title}
    })

    const result: ListingHistory = {
      summary: modelOutput.summary,
      citations,
      generated_at: new Date().toISOString(),
      cached: false,
    }

    await this.cache(listingId, listing, result)
    return result
  }

  private async cache(
    listingId: string,
    listing: ListingForRetrieval,
    result: ListingHistory,
  ): Promise<void> {
    const contentHash = createHash('sha256')
      .update(`${listing.title}|${listing.description}`)
      .digest('hex')
    await pool.query(
      `INSERT INTO kithistory.listing_history
         (listing_id, content_hash, entities, summary, citations)
       VALUES ($1, $2, '{}'::jsonb, $3, $4::jsonb)
       ON CONFLICT (listing_id) DO UPDATE
         SET content_hash = EXCLUDED.content_hash,
             summary      = EXCLUDED.summary,
             citations    = EXCLUDED.citations,
             generated_at = now()`,
      [listingId, contentHash, result.summary, JSON.stringify(result.citations)],
    )
  }
}
