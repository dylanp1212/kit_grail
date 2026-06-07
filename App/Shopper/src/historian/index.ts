export interface Citation {
  index: number
  url: string
  title: string
}

export interface ListingHistory {
  summary: string
  citations: Citation[]
  generated_at: string
  cached: boolean
}
