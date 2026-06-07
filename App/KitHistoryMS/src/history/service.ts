import {pool} from '../db'
import {Citation, ListingHistory} from '.'

interface CachedRow {
  summary: string
  citations: Citation[]
  generated_at: Date
}

export class HistoryService {
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
}
