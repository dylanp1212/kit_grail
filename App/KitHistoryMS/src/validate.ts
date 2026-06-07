import {ModelOutput} from './llm'
import {RetrievedChunk} from './retrieve'

export interface ValidationResult {
  ok: boolean
  reason?: string
}

// Hard guard. Rejects any LLM output that:
//   (a) cites a [N] index outside the retrieved set,
//   (b) makes a [N] claim in the summary without a matching citation entry,
//   (c) repeats a citation index (so we don't double-count for hydration).
// The model NEVER provides URL/title — that's hydrated from the retrieved
// chunks server-side — so URL hallucinations are structurally impossible.
export function validateCitations(
  output: ModelOutput,
  retrieved: RetrievedChunk[],
): ValidationResult {
  const allowed = new Set<number>()
  for (let i = 0; i < retrieved.length; i++) allowed.add(i + 1)

  const seen = new Set<number>()
  for (const c of output.citations) {
    if (!Number.isInteger(c.index)) {
      return {ok: false, reason: `Citation index not an integer: ${String(c.index)}`}
    }
    if (!allowed.has(c.index)) {
      return {ok: false, reason: `Citation [${c.index}] not in retrieved set (1..${retrieved.length})`}
    }
    if (seen.has(c.index)) {
      return {ok: false, reason: `Citation [${c.index}] appears more than once`}
    }
    seen.add(c.index)
  }

  // Every [N] appearing in the summary must have a citation entry.
  const summaryRefs = [...output.summary.matchAll(/\[(\d+)\]/g)].map((m) =>
    parseInt(m[1], 10),
  )
  for (const ref of summaryRefs) {
    if (!seen.has(ref)) {
      return {ok: false, reason: `Summary cites [${ref}] but no citation entry exists for it`}
    }
  }

  return {ok: true}
}
