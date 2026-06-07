 
// Corpus ingest. Reads scripts/sources.json (curated Wikipedia URLs),
// fetches each page, chunks the prose, embeds with Gemini (or the stub
// embedder if GEMINI_API_KEY is unset), and upserts into
// kithistory.source + kithistory.chunk.
//
// Idempotent: source.url is UNIQUE, chunks are deleted by source_id
// before reinsert so re-running this script refreshes a page cleanly.
//
// Run:  cd App/KitHistoryMS && npm run ingest
//
// Pre-reqs:
//   - postgres reachable (POSTGRES_HOST/PORT/DB/USER/PASSWORD env)
//   - kithistory schema loaded (docker compose up brings the volume init)
//   - GEMINI_API_KEY in env for real embeddings (stub falls back otherwise)

import 'dotenv/config'
import {readFileSync} from 'fs'

import {pool} from '../src/db'
import {LlmClient} from '../src/llm'
import {chunkText} from './chunk'
import {fetchWikipediaPage} from './wikipedia'

const sources = JSON.parse(
  readFileSync(`${__dirname}/sources.json`, 'utf-8'),
) as string[]

const llm = new LlmClient()
if (llm.stubbed) {
  console.warn(
    '⚠️  GEMINI_API_KEY not set — embeddings will be deterministic stubs.\n' +
    '    Useful for smoke-testing the pipeline, useless for real retrieval.\n',
  )
}

async function ingestUrl(url: string): Promise<number> {
  const page = await fetchWikipediaPage(url)

  const source = await pool.query<{id: string}>(
    `INSERT INTO kithistory.source (url, title)
     VALUES ($1, $2)
     ON CONFLICT (url) DO UPDATE
       SET title = EXCLUDED.title, fetched_at = now()
     RETURNING id`,
    [url, page.title],
  )
  const sourceId = source.rows[0].id

  await pool.query(`DELETE FROM kithistory.chunk WHERE source_id = $1`, [sourceId])

  let ordinal = 0
  for (const section of page.sections) {
    const chunks = chunkText(section.text, section.heading)
    for (const c of chunks) {
      const embedding = await llm.embed(c.text)
      await pool.query(
        `INSERT INTO kithistory.chunk (source_id, ordinal, text, embedding, data)
         VALUES ($1, $2, $3, $4::vector, $5::jsonb)`,
        [
          sourceId,
          ordinal++,
          c.text,
          `[${embedding.join(',')}]`,
          JSON.stringify(c.data),
        ],
      )
    }
  }
  return ordinal
}

async function main(): Promise<void> {
  console.log(`Ingesting ${sources.length} sources...\n`)
  let totalChunks = 0
  let failures = 0
  for (const url of sources) {
    process.stdout.write(`▸ ${url}\n`)
    try {
      const n = await ingestUrl(url)
      console.log(`  ✓ ${n} chunks\n`)
      totalChunks += n
    } catch (err) {
      failures++
      console.error(`  ✗ ${(err as Error).message}\n`)
    }
  }
  await pool.end()
  console.log(`\nDone. ${totalChunks} chunks across ${sources.length - failures} sources.`)
  if (failures > 0) {
    console.log(`${failures} sources failed — rerun the script to retry just those (it's idempotent).`)
  }
}

void main()
