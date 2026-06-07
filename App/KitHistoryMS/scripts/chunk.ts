// Greedy paragraph-aware chunker. Caps each chunk at ~500 tokens (using
// 4 chars/token as a rough proxy) and overlaps the last paragraph into
// the next chunk so a claim that spans a paragraph break keeps context.
// Never splits mid-paragraph.

const TARGET_CHARS = 500 * 4
const OVERLAP_LIMIT = 60 * 4 * 2

export interface ChunkOut {
  text: string
  data: {heading?: string}
}

export function chunkText(text: string, heading?: string): ChunkOut[] {
  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)

  if (paragraphs.length === 0) return []

  const out: string[] = []
  let current: string[] = []
  let currentLen = 0

  for (const p of paragraphs) {
    const candidateLen = currentLen + p.length + (current.length > 0 ? 2 : 0)
    if (candidateLen > TARGET_CHARS && current.length > 0) {
      out.push(current.join('\n\n'))
      const last = current[current.length - 1]
      if (last.length <= OVERLAP_LIMIT) {
        current = [last, p]
        currentLen = last.length + 2 + p.length
      } else {
        current = [p]
        currentLen = p.length
      }
    } else {
      current.push(p)
      currentLen = candidateLen
    }
  }
  if (current.length > 0) out.push(current.join('\n\n'))

  return out.map((t) => ({text: t, data: heading ? {heading} : {}}))
}
