import {describe, expect, it, vi} from 'vitest'

import {fetchWikipediaPage, parseWikipediaHtml} from '../scripts/wikipedia'

const SAMPLE_HTML = `
<html><body>
  <p>Lead paragraph that should sit under the article title heading and be long enough to count as prose.</p>
  <table class="infobox"><tr><td>infobox stuff should be stripped</td></tr></table>
  <h2>Career</h2>
  <p>First career paragraph with enough text to clear the 50-character minimum filter so we keep it.</p>
  <p>Second career paragraph also long enough to make the cut for ingestion.</p>
  <sup class="reference">[1]</sup>
  <h3>Real Madrid</h3>
  <p>Joined Real Madrid in 2001 — this sentence is intentionally long enough to be kept by the parser.</p>
  <div class="navbox">nav junk to be stripped</div>
  <h2>References</h2>
  <p>Reference section paragraphs would normally be stripped at the source list level.</p>
</body></html>
`

describe('parseWikipediaHtml', () => {
  it('groups paragraphs under whichever h2/h3 last appeared', () => {
    const page = parseWikipediaHtml(SAMPLE_HTML, 'Sample')
    const headings = page.sections.map((s) => s.heading)
    expect(headings).toContain('Sample')
    expect(headings).toContain('Career')
    expect(headings).toContain('Real Madrid')
  })

  it('strips infoboxes, navboxes, and sup references', () => {
    const page = parseWikipediaHtml(SAMPLE_HTML, 'Sample')
    const joined = page.sections.map((s) => s.text).join(' ')
    expect(joined).not.toContain('infobox')
    expect(joined).not.toContain('nav junk')
    expect(joined).not.toContain('[1]')
  })

  it('drops paragraphs under 50 chars (whitespace, footers, etc.)', () => {
    const page = parseWikipediaHtml(
      '<html><body><h2>X</h2><p>short</p><p>This paragraph is long enough to be retained by the parser.</p></body></html>',
      'Sample',
    )
    const xSection = page.sections.find((s) => s.heading === 'X')
    expect(xSection?.text).toContain('long enough to be retained')
    expect(xSection?.text).not.toContain('short')
  })

  it('returns the article title alongside sections', () => {
    const page = parseWikipediaHtml(SAMPLE_HTML, 'Cool Player')
    expect(page.title).toBe('Cool Player')
  })
})

describe('fetchWikipediaPage', () => {
  it('rejects non-Wikipedia URLs', async () => {
    await expect(fetchWikipediaPage('https://example.com')).rejects.toThrow(
      /Wikipedia article URL/,
    )
  })

  it('GETs the REST endpoint for the slug and parses the response', async () => {
    const fetchFn = vi.fn(async () =>
      new Response(SAMPLE_HTML, {status: 200, headers: {'Content-Type': 'text/html'}}),
    )
    const page = await fetchWikipediaPage(
      'https://en.wikipedia.org/wiki/Zinedine_Zidane',
      fetchFn as unknown as typeof fetch,
    )
    const url = fetchFn.mock.calls[0][0] as string
    expect(url).toBe(
      'https://en.wikipedia.org/api/rest_v1/page/html/Zinedine_Zidane',
    )
    expect(page.title).toBe('Zinedine Zidane')
    expect(page.sections.length).toBeGreaterThan(0)
  })

  it('throws on non-2xx response', async () => {
    const fetchFn = vi.fn(async () => new Response('nope', {status: 404}))
    await expect(
      fetchWikipediaPage(
        'https://en.wikipedia.org/wiki/Nonexistent',
        fetchFn as unknown as typeof fetch,
      ),
    ).rejects.toThrow(/404/)
  })
})
