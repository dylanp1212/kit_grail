// needed to not get error in testing environment
const isTest = process.env.NODE_ENV === 'test';
if (!isTest) {
  await import('server-only');
}

import {ListingHistory} from '.'

const MS_URL = process.env.HISTORY_MS_URL ?? 'http://localhost:3016/api/v0'
const TIMEOUT_MS = 6000

export class HistorianService {
  // Returns null on any failure (timeout, 4xx, 5xx, network error, etc.).
  // The History section is purely an enhancement — never surface a failure
  // to the user, just don't render anything.
  public async getListingHistory(id: string): Promise<ListingHistory | null> {
    const controller = new AbortController()
    const timer = setTimeout(() => { controller.abort() }, TIMEOUT_MS)
    try {
      const res = await fetch(
        `${MS_URL}/history/listings/${encodeURIComponent(id)}`,
        {signal: controller.signal},
      )
      if (!res.ok) return null
      return await res.json() as ListingHistory
    } catch {
      return null
    } finally {
      clearTimeout(timer)
    }
  }
}
