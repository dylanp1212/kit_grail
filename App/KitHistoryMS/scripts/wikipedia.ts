import * as cheerio from 'cheerio'

export interface WikipediaSection {
  heading: string
  text: string
}

export interface FetchedPage {
  title: string
  sections: WikipediaSection[]
}

// Polite rate limit for the Wikipedia REST API.
const RATE_LIMIT_MS = 1000
let lastFetchAt = 0

async function rateLimit(): Promise<void> {
  const elapsed = Date.now() - lastFetchAt
  if (elapsed < RATE_LIMIT_MS) {
    await new Promise((r) => setTimeout(r, RATE_LIMIT_MS - elapsed))
  }
  lastFetchAt = Date.now()
}

function articleSlug(url: string): string {
  const m = /wikipedia\.org\/wiki\/(.+?)(?:#|\?|$)/.exec(url)
  if (!m) throw new Error(`Not a Wikipedia article URL: ${url}`)
  return m[1]
}

export async function fetchWikipediaPage(
  url: string,
  fetchFn: typeof fetch = fetch,
): Promise<FetchedPage> {
  await rateLimit()
  const slug = articleSlug(url)
  const restUrl = `https://en.wikipedia.org/api/rest_v1/page/html/${slug}`
  const res = await fetchFn(restUrl, {
    headers: {
      Accept: 'text/html',
      'User-Agent': 'KitGrail/0.1 (cse187@ucsc.edu) historian-ingest',
    },
  })
  if (!res.ok) throw new Error(`Wikipedia fetch failed (${res.status}): ${restUrl}`)
  const html = await res.text()
  const title = decodeURIComponent(slug).replace(/_/g, ' ')
  return parseWikipediaHtml(html, title)
}

// Strip nav/footnotes/infoboxes/metadata, then walk the top-level
// elements in document order, accumulating <p> text under whichever
// <h2>/<h3> last appeared.
export function parseWikipediaHtml(html: string, title: string): FetchedPage {
  const $ = cheerio.load(html)
  $('.reference, .navbox, .infobox, .hatnote, .sidebar, sup, .mw-editsection, .reflist, .gallery, table').remove()

  const sections: WikipediaSection[] = []
  let heading = title
  let buffer: string[] = []

  const flush = () => {
    if (buffer.length > 0) {
      sections.push({heading, text: buffer.join('\n\n')})
      buffer = []
    }
  }

  $('h2, h3, p').each((_, el) => {
    const tag = (el as {name?: string}).name
    const text = $(el).text().trim().replace(/\s+/g, ' ')
    if (tag === 'h2' || tag === 'h3') {
      flush()
      heading = text || heading
    } else if (text.length > 50) {
      buffer.push(text)
    }
  })
  flush()

  return {title, sections}
}
