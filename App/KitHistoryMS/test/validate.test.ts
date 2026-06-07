import {describe, expect, it} from 'vitest'

import {RetrievedChunk} from '../src/retrieve'
import {validateCitations} from '../src/validate'

function chunk(idx: number): RetrievedChunk {
  return {
    id: `c${idx}`,
    source_id: `s${idx}`,
    source_url: `https://x/${idx}`,
    source_title: `Title ${idx}`,
    ordinal: 0,
    text: `chunk ${idx}`,
    distance: 0,
  }
}

describe('validateCitations', () => {
  const retrieved = [chunk(1), chunk(2), chunk(3)]

  it('accepts output that cites only retrieved indices', () => {
    const res = validateCitations(
      {summary: 'Claim [1] and another [2].', citations: [{index: 1}, {index: 2}]},
      retrieved,
    )
    expect(res.ok).toBe(true)
  })

  it('rejects a citation index above the retrieved count', () => {
    const res = validateCitations(
      {summary: 'Claim [4].', citations: [{index: 4}]},
      retrieved,
    )
    expect(res.ok).toBe(false)
    expect(res.reason).toContain('[4]')
  })

  it('rejects index zero (1-based)', () => {
    const res = validateCitations(
      {summary: 'x [0].', citations: [{index: 0}]},
      retrieved,
    )
    expect(res.ok).toBe(false)
  })

  it('rejects non-integer indices', () => {
    const res = validateCitations(
      {summary: 'x', citations: [{index: 1.5 as unknown as number}]},
      retrieved,
    )
    expect(res.ok).toBe(false)
  })

  it('rejects when the summary cites [N] but there is no matching citation entry', () => {
    const res = validateCitations(
      {summary: 'Claim [2].', citations: [{index: 1}]},
      retrieved,
    )
    expect(res.ok).toBe(false)
    expect(res.reason).toContain('[2]')
  })

  it('rejects duplicated citation indices', () => {
    const res = validateCitations(
      {summary: 'Claim [1].', citations: [{index: 1}, {index: 1}]},
      retrieved,
    )
    expect(res.ok).toBe(false)
    expect(res.reason).toContain('more than once')
  })

  it('accepts a summary with no [N] markers and no citations (no claims made)', () => {
    const res = validateCitations({summary: 'Sorry, no history.', citations: []}, retrieved)
    expect(res.ok).toBe(true)
  })

  it('handles multi-digit citation indices', () => {
    const big = Array.from({length: 12}, (_, i) => chunk(i + 1))
    const res = validateCitations(
      {summary: 'See [11] and [12].', citations: [{index: 11}, {index: 12}]},
      big,
    )
    expect(res.ok).toBe(true)
  })
})
