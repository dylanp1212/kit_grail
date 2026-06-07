import {describe, expect, it} from 'vitest'

import {chunkText} from '../scripts/chunk'

const PARA = (n: number, content = 'x') => content.repeat(n)

describe('chunkText', () => {
  it('returns one chunk for short text', () => {
    const out = chunkText('Just a short paragraph.\n\nAnother short one.')
    expect(out).toHaveLength(1)
    expect(out[0].text).toContain('Just a short')
    expect(out[0].text).toContain('Another short')
  })

  it('returns no chunks for empty input', () => {
    expect(chunkText('')).toEqual([])
    expect(chunkText('\n\n\n')).toEqual([])
  })

  it('splits when accumulated text exceeds the budget', () => {
    const text = [PARA(1500), PARA(1500), PARA(1500)].join('\n\n')
    const out = chunkText(text)
    expect(out.length).toBeGreaterThan(1)
  })

  it('overlaps the previous chunk\'s last short paragraph into the next chunk', () => {
    // Three big paragraphs forces a split. The second-to-last paragraph
    // should appear at the start of the second chunk so context carries over.
    const a = PARA(1500, 'a')
    const tail = 'short tail paragraph that should overlap'
    const b = PARA(1500, 'b')
    const out = chunkText([a, tail, b].join('\n\n'))
    expect(out.length).toBeGreaterThan(1)
    expect(out[1].text).toContain('short tail paragraph')
  })

  it('does not overlap a previous paragraph that exceeds the overlap budget', () => {
    const longTail = PARA(800, 't')
    const out = chunkText([PARA(1500, 'a'), longTail, PARA(1500, 'b')].join('\n\n'))
    // longTail itself takes up its own chunk. The chunk AFTER it should
    // start with 'b' — longTail is too big to overlap forward.
    const lastChunk = out[out.length - 1].text
    expect(lastChunk.startsWith(longTail)).toBe(false)
    expect(lastChunk.startsWith('b')).toBe(true)
  })

  it('attaches the heading to each chunk\'s data', () => {
    const out = chunkText('one paragraph here.', '2001-02 Real Madrid CF season')
    expect(out[0].data.heading).toBe('2001-02 Real Madrid CF season')
  })

  it('never produces a chunk with empty text', () => {
    const out = chunkText([PARA(800), PARA(800), PARA(800)].join('\n\n'))
    for (const c of out) {
      expect(c.text.length).toBeGreaterThan(0)
    }
  })
})
