import {describe, expect, it} from 'vitest'

import {assemblePrompt} from '../src/prompt'
import {RetrievedChunk} from '../src/retrieve'

function chunk(idx: number, text: string, sourceTitle: string): RetrievedChunk {
  return {
    id: `c${idx}`,
    source_id: `s${idx}`,
    source_url: `https://en.wikipedia.org/${sourceTitle}`,
    source_title: sourceTitle,
    ordinal: 0,
    text,
    distance: 0,
  }
}

describe('assemblePrompt', () => {
  it('includes the listing title and description', () => {
    const p = assemblePrompt({
      listing: {title: '2014 Argentina Messi Jersey', description: 'Worn by Messi.'},
      chunks: [chunk(1, 'about Messi', 'Messi')],
    })
    expect(p).toContain('2014 Argentina Messi Jersey')
    expect(p).toContain('Worn by Messi.')
  })

  it('numbers chunks starting at [1]', () => {
    const p = assemblePrompt({
      listing: {title: 't', description: 'd'},
      chunks: [chunk(1, 'A', 'TitleA'), chunk(2, 'B', 'TitleB')],
    })
    expect(p).toContain('[1] TitleA:')
    expect(p).toContain('[2] TitleB:')
  })

  it('clamps any single chunk to the budget so one huge chunk cannot blow the prompt', () => {
    const huge = 'x'.repeat(5000)
    const p = assemblePrompt({
      listing: {title: 't', description: 'd'},
      chunks: [chunk(1, huge, 'Huge')],
    })
    expect(p).toContain('...')
    expect(p.length).toBeLessThan(huge.length)
  })

  it('includes structured fields when present', () => {
    const p = assemblePrompt({
      listing: {
        title: 't',
        description: 'd',
        player: 'Zidane',
        club: 'Real Madrid',
        season: '2001-02',
        competition: 'UCL',
      },
      chunks: [chunk(1, 'A', 'TitleA')],
    })
    expect(p).toContain('Player: Zidane')
    expect(p).toContain('Club: Real Madrid')
    expect(p).toContain('Season: 2001-02')
    expect(p).toContain('Competition: UCL')
  })

  it('omits the structured-fields line entirely when none are set', () => {
    const p = assemblePrompt({
      listing: {title: 't', description: 'd'},
      chunks: [chunk(1, 'A', 'TitleA')],
    })
    expect(p).not.toContain('Player:')
    expect(p).not.toContain('Club:')
  })

  it('asks for a strict JSON shape and tells the model to cite with [N]', () => {
    const p = assemblePrompt({
      listing: {title: 't', description: 'd'},
      chunks: [chunk(1, 'A', 'TitleA')],
    })
    expect(p).toContain('strict JSON')
    expect(p).toMatch(/\[N\]/)
    expect(p).toContain('summary')
    expect(p).toContain('citations')
  })

  it('tells the model not to invent facts', () => {
    const p = assemblePrompt({
      listing: {title: 't', description: 'd'},
      chunks: [chunk(1, 'A', 'TitleA')],
    })
    expect(p.toLowerCase()).toMatch(/do not invent|only use|only material/i)
  })
})
