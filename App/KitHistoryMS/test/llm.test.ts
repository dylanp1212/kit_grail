import {describe, expect, it, vi} from 'vitest'

import {LlmClient, stubEmbed, stubGenerate} from '../src/llm'

describe('stubEmbed', () => {
  it('returns a 768-dim vector', () => {
    expect(stubEmbed('anything').length).toBe(768)
  })

  it('is deterministic', () => {
    expect(stubEmbed('zidane')).toEqual(stubEmbed('zidane'))
  })

  it('different inputs give different vectors', () => {
    expect(stubEmbed('zidane')).not.toEqual(stubEmbed('maradona'))
  })

  it('vectors are normalised (unit length)', () => {
    const v = stubEmbed('test input')
    const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0))
    expect(norm).toBeCloseTo(1, 5)
  })
})

describe('stubGenerate', () => {
  it('returns a summary and a non-empty citations array', () => {
    const out = stubGenerate('some prompt')
    expect(typeof out.summary).toBe('string')
    expect(out.citations.length).toBeGreaterThan(0)
  })

  it('cites the first [N] source line from the prompt', () => {
    const prompt = 'header\n[3] Pelé Wikipedia bio\n[4] Brazil 1970 page\nquery'
    const out = stubGenerate(prompt)
    expect(out.summary).toContain('[3]')
    expect(out.citations[0].index).toBe(3)
    expect(out.citations[0].title).toContain('Pelé')
  })
})

describe('LlmClient (stubbed mode)', () => {
  it('reports stubbed=true when no API key is configured', () => {
    const client = new LlmClient({apiKey: undefined})
    expect(client.stubbed).toBe(true)
  })

  it('embed returns the deterministic stub when stubbed', async () => {
    const client = new LlmClient({apiKey: undefined})
    expect(await client.embed('zidane')).toEqual(stubEmbed('zidane'))
  })

  it('generate returns the deterministic stub when stubbed', async () => {
    const client = new LlmClient({apiKey: undefined})
    const out = await client.generate('[1] thing')
    expect(out.summary).toContain('[1]')
  })
})

describe('LlmClient (real-API mode, mocked fetch)', () => {
  it('embed POSTs to the right Gemini URL and parses the response', async () => {
    const fetchFn = vi.fn(async () =>
      new Response(
        JSON.stringify({embedding: {values: new Array(768).fill(0.5)}}),
        {status: 200, headers: {'Content-Type': 'application/json'}},
      ),
    )
    const client = new LlmClient({apiKey: 'fake-key', fetchFn: fetchFn as unknown as typeof fetch})
    const vec = await client.embed('hello')
    expect(vec.length).toBe(768)
    expect(vec[0]).toBe(0.5)
    const url = fetchFn.mock.calls[0][0] as string
    expect(url).toContain('text-embedding-004:embedContent')
    expect(url).toContain('key=fake-key')
  })

  it('embed rejects responses with wrong dimensionality', async () => {
    const fetchFn = vi.fn(async () =>
      new Response(JSON.stringify({embedding: {values: [1, 2, 3]}}), {status: 200}),
    )
    const client = new LlmClient({apiKey: 'fake-key', fetchFn: fetchFn as unknown as typeof fetch})
    await expect(client.embed('hi')).rejects.toThrow(/wrong shape/)
  })

  it('embed rejects on non-2xx', async () => {
    const fetchFn = vi.fn(async () => new Response('nope', {status: 500}))
    const client = new LlmClient({apiKey: 'fake-key', fetchFn: fetchFn as unknown as typeof fetch})
    await expect(client.embed('hi')).rejects.toThrow(/embed failed: 500/)
  })

  it('generate parses JSON from the candidate text', async () => {
    const payload = {summary: 'real summary [1]', citations: [{index: 1, url: 'u', title: 't'}]}
    const fetchFn = vi.fn(async () =>
      new Response(
        JSON.stringify({candidates: [{content: {parts: [{text: JSON.stringify(payload)}]}}]}),
        {status: 200, headers: {'Content-Type': 'application/json'}},
      ),
    )
    const client = new LlmClient({apiKey: 'k', fetchFn: fetchFn as unknown as typeof fetch})
    const out = await client.generate('prompt')
    expect(out.summary).toBe('real summary [1]')
    expect(out.citations[0].url).toBe('u')
  })

  it('generate rejects malformed model output', async () => {
    const fetchFn = vi.fn(async () =>
      new Response(
        JSON.stringify({candidates: [{content: {parts: [{text: '{"summary": 1}'}]}}]}),
        {status: 200},
      ),
    )
    const client = new LlmClient({apiKey: 'k', fetchFn: fetchFn as unknown as typeof fetch})
    await expect(client.generate('prompt')).rejects.toThrow(/wrong shape/)
  })
})
