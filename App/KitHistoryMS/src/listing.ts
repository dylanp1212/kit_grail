// Fetches a listing's text fields from Kit_ListingMS. Public endpoint, no
// auth. Optional structured fields (player/club/season/competition) land
// when commit 7 adds the seller-fill form; until then we fall back to
// title+description as the retrieval query.

export interface ListingForRetrieval {
  id: string
  seller: string
  title: string
  description: string
  player?: string
  club?: string
  season?: string
  competition?: string
}

const kitListingUrl = () =>
  process.env.KIT_LISTING_MS_URL ?? 'http://localhost:3011/api/v0'

export async function fetchListing(
  id: string,
  fetchFn: typeof fetch = fetch,
): Promise<ListingForRetrieval | null> {
  const res = await fetchFn(`${kitListingUrl()}/kit-listing/${id}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`fetchListing failed: ${res.status}`)
  return (await res.json()) as ListingForRetrieval
}

// The retrieval query string used to build the query embedding. Prefers
// structured fields when present, falls back to title+description.
export function retrievalQuery(listing: ListingForRetrieval): string {
  const structured = [listing.player, listing.club, listing.season, listing.competition]
    .filter((v): v is string => typeof v === 'string' && v.length > 0)
  if (structured.length > 0) {
    return structured.join(' ')
  }
  return `${listing.title}. ${listing.description.slice(0, 300)}`
}
