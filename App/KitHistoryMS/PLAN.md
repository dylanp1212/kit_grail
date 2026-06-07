# Jersey Historian — Integration Plan

A RAG-powered service that generates short, cited historical context for each
jersey listing (e.g. "Zidane wore this kit in the 2002 UCL Final [1]"). Must
run as a separate service so the marketplace works fine without it.

This plan is the result of reading the existing codebase. It uses existing
conventions where they exist and only proposes new ones where the codebase
has no precedent. The directory **proposed by the brief** (`Service/Historian/`)
does **not** match this repo's convention — all backend services live under
`App/<Name>MS/`. Treat the rest of this doc as a proposal to use
`App/KitHistoryMS/` instead; if the brief's path is mandated, swap it
mechanically.

---

## 1. Repo map (relevant slice only)

```
App/
├── AuthService/           Express + TSOA + JWE.  Port 3010.
├── Kit_ListingMS/         Express + TSOA.        Port 3011.   ← listing data
├── WishlistMS/            Express + GraphQL.     Port 3012.
├── Seller/backend/        Express + TSOA.        Port 3013.   ← proxies seller calls
├── CheckoutMS/            Express + TSOA + Stripe. Port 3014. ← orders + pgvector candidate
├── ShoppingCartMS/        Express + GraphQL.     Port 3015.
├── Shopper/               Next.js 16 app router. Port 3002.   ← UI integration target
├── Seller/frontend/       Vite + React.          Port 3001 (preview).
├── Admin/                 Next.js 16 app router. Port 3003.
├── HelloWorld/            scaffolded ref.
├── nginx.conf             routes /api/v0/* and /sell, /admin, / → respective ports
├── docker-compose.yml     one `kitgrail` container runs all services concurrently,
│                          one `kitgrail-db` container runs postgres:alpine
└── Dockerfile             COPYs each service's prebuilt `build/`, `.next/`, or `dist/`
```

### Patterns to mirror

- **Microservice skeleton**: `src/app.ts` (Express + cors + tsoa-generated routes + swagger),
  `src/server.ts` (single `app.listen(<PORT>)`), `src/db.ts` (single shared pg Pool reading
  `POSTGRES_*` env), `src/<domain>/{controller.ts, service.ts, index.ts}`,
  `tsoa.json`, `vitest.config.ts`, `vitest.setup.ts`, `build/` checked in.
- **Service-to-service calls**: plain `fetch(`http://localhost:<PORT>/api/v0/...`)` from
  the caller's service layer. Hardcoded localhost URLs — known debt (see audit). For
  this service I will use `HISTORY_MS_URL` env with `http://localhost:3016/api/v0`
  default.
- **Shopper integration**: server actions in `App/Shopper/src/<domain>/actions.ts`
  that wrap a thin `service.ts` which `fetch`s the MS. The `viewlisting` route already
  follows this pattern with `getKitListingById`.
- **Tests**: vitest, `supertest` for endpoint tests, real Postgres in CI, `msw` only
  in Shopper/Seller frontends to mock outbound HTTP.
- **CI**: `.gitlab-ci.yml` has `check:<name>` (lint/cpd/build) and `test:<name>`
  per service. New service must add both.
- **Docker-compose**: a single `kitgrail` container starts all services via
  `concurrently`. Adding KitHistoryMS means a new `start-kithistory` script and an
  entry in `start-container`.

---

## 2. Listing data model — what's missing for RAG

`kit_listing` is `(id UUID, seller UUID, data jsonb)`. The jsonb has:

| Field | Type | Notes |
|---|---|---|
| `title` | string | free-text, e.g. `"2014 Argentina Messi Jersey"` |
| `description` | string | seller-written prose |
| `size` | enum | xsmall…xlarge |
| `colors` | string[] | curated palette names |
| `price` | number | |
| `image` | string | URL |
| `quantity` | number | |
| `listed` | timestamp | |
| `active` | bool? (sometimes) | added by checkout flow |

**There are no structured fields for player, club, season, or competition.** Title
parsing is the only signal today. For RAG retrieval to be precise, the kithistory
needs *something* normalised. Three options, ranked:

1. **Default — augment the seller listing form with typeahead-backed fields.**
   Add `player`, `club`, `season`, `competition` as optional keys on
   `kit_listing.data`. Seller frontend `ListingForm` gets four inputs; `player`
   and `club` use MUI `<Autocomplete freeSolo>` against a curated JSON dataset
   (~500 famous players, ~500 famous clubs) — users can pick from the dropdown
   or type any free-text value. Higher quality retrievals, sellers stay in
   control. Scope ~8 files / ~150 LOC, broken out below.
2. **Fallback — auto-extract on the first view.** For listings where the
   seller left structured fields blank (and for the 25+ existing seed
   listings), KitHistoryMS calls Gemini once to extract entities from
   `title + description`, caches the result in
   `kithistory.listing_history.entities`, and flags `entities.source = 'auto'`
   so we can audit later. This is a backstop, not the primary path.
3. Skipped — making the fields required would break existing data and slow
   listing creation.

**Plan assumes (1) as default + (2) as backstop.** Both layers are needed even
if we picked seller-fill alone, because old data has no structured fields and
the kithistory must do *something* useful when they're missing.

### Scope of the seller-fill addition (commit 2 of the rollout)

Roughly **8 files modified + ~150 LOC**. Lands as its own commit after the
KitHistoryMS scaffold is in.

- `App/Kit_ListingMS/src/kit_listing/index.ts` — add four optional fields to
  `NewKitListing`, `KitListing`, `KitListingPatch`.
- `App/Kit_ListingMS/test/createNewKitListing.test.ts` — assert round-trip.
- `App/Seller/frontend/src/api/listings.ts` — propagate fields on `NewListing`
  and `MyListing`.
- `App/Seller/frontend/src/pages/ListingForm.tsx` — four inputs; player + club
  use MUI `<Autocomplete freeSolo>` against the static dataset.
- `App/Seller/frontend/src/data/players.json`, `data/clubs.json` — curated
  ~500-entry datasets. Same lists also seed the KitHistoryMS corpus sources.
- `App/Seller/frontend/src/i18n.ts` — 4 labels × 2 locales.
- `App/Seller/frontend/test/pages/ListingFormPage.test.tsx` — assert each
  field renders, submits, and survives an edit roundtrip.

Schema: no change — `kit_listing.data` is jsonb so new keys land for free.

---

## 3. KitHistoryMS service design

### Stack

Express + TSOA + supertest + vitest. Matches every other backend microservice
in the repo. Picking Fastify would be cheaper at runtime but a real cognitive
cost — there's no precedent in this codebase. Stay consistent.

Node 20 (matches `.gitlab-ci.yml` default image and the other services).

### Port & routing

- Listens on **3016** (3010–3015 taken).
- nginx adds:
  ```
  location /api/v0/kithistory/ {
      proxy_pass http://localhost:3016/api/v0/kithistory/;
      proxy_read_timeout 10s;        # bound the user-facing wait
  }
  ```
- `App/package.json` gains `start-kithistory` and adds it to `start-container`.
- Dockerfile gets a `COPY KitHistoryMS/package.json` + `COPY KitHistoryMS/build/`
  pair to match the existing per-service blocks.

### API surface

Everything lives under `/api/v0/kithistory`.

| Method + Path | Body / Query | Response | Notes |
|---|---|---|---|
| `GET /listings/{id}/history` | — | `{ summary: string, citations: Array<{ index, url, title }>, generated_at: string, cached: boolean }` (200) <br/> 404 if listing unknown to kithistory (e.g. extraction returned no useful entities) <br/> 503 if Gemini/embedding call fails and no cache exists | Hot path. Public, no auth. Always cache-first. |
| `POST /listings/{id}/refresh` | — | 202 with `{ status: 'queued' \| 'in_progress' }` | Forces a regeneration. Used by admin/seller after edits. JWE-gated with `@Security('jwe')` and `role` check. |
| `GET /health` | — | `{ ok: true, model: ..., chunks: <count> }` | For monitoring. |
| `GET /api/v0/docs` | — | swagger-ui html | Existing pattern. |

The `GET …/history` endpoint must be **fast for cached responses (< 50ms)** and
**bounded for cold misses (< 8s, otherwise return 503)**. The Shopper UI will
apply a 6s client-side timeout so a cold miss never blocks the listing page.

### Internal flow on cold miss

```
GET /listings/{id}/history
  ↓
1. SELECT FROM listing_history WHERE listing_id = $1
   ↳ if hit & not expired & content_hash matches kit_listing → return it
2. fetch listing from Kit_ListingMS (no auth; that route is public)
3. extract entities (LLM call) — cached in listing_history.entities
4. build retrieval query from entities → embed → ANN search top K (default 8) from chunks
5. assemble prompt with K chunks + entity stub
6. call generation LLM, force JSON output { summary, citations: [...] }
7. validate every citation index appears in retrieved chunks (hallucination guard)
8. write listing_history row with content_hash = sha256(title|description|entities)
9. return
```

### Database: separate schema, same DB

Same `dev` postgres, separate schema namespace so we never break Shopper's tables:

```sql
CREATE SCHEMA IF NOT EXISTS kithistory;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE kithistory.source (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url           TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  fetched_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  data          jsonb DEFAULT '{}'::jsonb   -- raw HTML or metadata
);

CREATE TABLE kithistory.chunk (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id     UUID NOT NULL REFERENCES kithistory.source(id) ON DELETE CASCADE,
  ordinal       INT NOT NULL,                -- order within source
  text          TEXT NOT NULL,
  embedding     vector(768) NOT NULL,        -- Gemini text-embedding-004 dim
  data          jsonb DEFAULT '{}'::jsonb    -- e.g. section header, anchor
);
CREATE INDEX chunk_embedding_ivfflat
  ON kithistory.chunk USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE TABLE kithistory.listing_history (
  listing_id    UUID PRIMARY KEY,
  content_hash  TEXT NOT NULL,               -- of title+description+entities
  entities      jsonb NOT NULL,              -- {player, club, season, competition}
  summary       TEXT NOT NULL,
  citations     jsonb NOT NULL,              -- [{ index, url, title }]
  generated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  data          jsonb DEFAULT '{}'::jsonb
);
```

Tables sit in the `kithistory` schema so they neither collide with nor depend on
the marketplace tables. No FK from `listing_history.listing_id` to
`kit_listing.id` — keeping it FK-free means revoking the listing doesn't cascade
into the kithistory DB and a Historian DB reset doesn't require Shopper coordination.

SQL lives at `App/KitHistoryMS/sql/schema.sql` and is mounted in `docker-compose.yml`
as `6.kithistory.schema.sql` after the existing checkout schema mount.

### pgvector availability

Not installed. Two paths:

- **Swap the postgres image** in `docker-compose.yml` from `postgres:alpine`
  to `pgvector/pgvector:pg16-alpine` (or `pg18` if it exists by now). The image
  is upstream-maintained and a drop-in. Data volume survives.
- Install the extension inside the existing alpine image: extra Dockerfile work,
  more brittle, not worth it.

**Recommended: swap the image.** Risk = re-init of the postgres data volume on
the swap; that already happens often in this project (per the audit). Worth a
team-meeting flag.

### Caching strategy

Two layers:

1. **Per-listing summary cache** in `kithistory.listing_history`, keyed by
   `listing_id` with `content_hash` for invalidation. No TTL; invalidate on
   `content_hash` mismatch or explicit `POST .../refresh`. This is what makes
   the user-facing latency feel fine.
2. **No vector-cache layer.** ANN search over 5–15k chunks is sub-millisecond
   with ivfflat. Skip.

### Failure modes & graceful degradation

The marketplace must be unaffected when KitHistoryMS is dead. Strategies:

- **Shopper side** uses a server action `getListingHistory(id)` with a 6s
  AbortController. On reject/timeout it returns `null`. The viewlisting page
  renders the History section only when the value is non-null. No error toast.
- **KitHistoryMS side** returns 503 on cold miss + LLM-down. A cached row is
  preferred over a fresh attempt that risks failing — the cold-miss path has a
  4s timeout for the Gemini call; on timeout, it returns 503 (or stale cache if
  one exists for the listing).
- **CheckoutMS/SellerBackend** never call Historian. There is no cycle.
- **Marketplace tests** never start KitHistoryMS. They stub the server action.

### Environment variables

In `App/.env` (added to the consolidated env file):

```
HISTORY_MS_URL=http://localhost:3016/api/v0/kithistory   # for Shopper

GEMINI_API_KEY=...                                         # for KitHistoryMS only
HISTORY_EMBED_MODEL=text-embedding-004                   # 768-dim
HISTORY_GEN_MODEL=gemini-1.5-flash                       # cheap+fast
HISTORY_TOP_K=8
HISTORY_GEN_TIMEOUT_MS=4000
HISTORY_CHUNKS_DIM=768                                   # matches embed model
```

`GEMINI_API_KEY` must be optional in tests — fall back to a deterministic stub
when `NODE_ENV=test`.

---

## 4. Corpus pipeline (offline)

Lives at `App/KitHistoryMS/scripts/`. Not part of the runtime service. Not in CI.

### Curated source list

Plain text or JSON file at `App/KitHistoryMS/scripts/sources.json` with a flat
list of Wikipedia URLs. Curated, not scraped at random — this controls quality
and keeps the corpus auditable.

Suggested coverage for the demo:
- Top 30 players (Messi, Ronaldo, Zidane, Maradona, Cruyff, Pelé, …)
- Top 20 clubs (Real Madrid, Barcelona, Bayern, …)
- World Cup finals 1970–2022 (one page each)
- UCL/Copa America/Euros finals 2000–2024
- Notable seasons (Real Madrid 2001-02 La Liga, etc.)

About 200 source URLs → 5–15k chunks after splitting. Easy to grow.

### Pipeline steps (single script entrypoint `scripts/ingest.ts`)

1. Read `sources.json`.
2. For each URL, fetch via Wikipedia REST API (`https://en.wikipedia.org/api/rest_v1/page/html/<title>`).
   No JS, no Cloudflare, polite Accept headers, 1 req/sec rate limit.
3. Parse HTML (`cheerio`), strip nav/footnotes/infoboxes, keep prose under
   each `<h2>`/`<h3>` heading.
4. Chunk: target ~500 tokens, 60-token overlap, never split mid-paragraph.
   Store the immediately-preceding heading in `chunk.data.heading`.
5. Embed in batches of 100 (Gemini limit) → write to `kithistory.chunk`.
6. Upsert `kithistory.source` first, then bulk insert `kithistory.chunk` with a
   `(source_id, ordinal)` constraint so reruns are idempotent.

A second script `scripts/refresh.ts` re-fetches a single source by URL and
replaces its chunks. Used when a Wikipedia page is materially updated.

A third script `scripts/dedupe.ts` runs an ANN search across chunks to find
near-duplicates (cosine > 0.97) and lets a human delete. One-time cleanup
when a source list grows.

### Why scripts and not a service

- Long-running (10+ minutes for the initial ingest)
- Bursty external API usage that shouldn't share a process with the live web service
- One-shot at build/deploy time
- Easy to extend later into a queue worker if needed

---

## 5. Marketplace UI integration

### Where

`App/Shopper/src/app/viewlisting/View.tsx` is the single-listing page. The
`<View />` component already client-renders the title, price, image and option
menu. The History section slots in below the description, above the
add-to-cart row.

### How (server-action, client-render)

Add `App/Shopper/src/kithistory/{index.ts, actions.ts, service.ts}` mirroring
the `kit_listing/` module:

```
kithistory/
├── index.ts       export interface ListingHistory { summary, citations[] }
├── actions.ts     'use server'; getListingHistory(id) → ListingHistory | null
└── service.ts     thin fetch wrapper, 6s AbortController, returns null on error
```

The `<View />` component uses an extra `useEffect` after the listing fetch:

```
useEffect(() => {
  if (!listing) return
  const ac = new AbortController()
  getListingHistory(listing.id, { signal: ac.signal })
    .then(setHistory)
    .catch(() => {})           // swallow — section just won't show
  return () => ac.abort()
}, [listing?.id])
```

`history` is `null | undefined | ListingHistory`. The History section renders
only when truthy:

- Title chip (i18n key `History.title` — also added to `messages/en.json`,
  `messages/es.json`)
- Summary text with inline `[1][2]` rendered as superscript `<a>` opening
  `citation.url` in a new tab
- A small "AI-generated context. See sources." disclaimer

Empty/error states: nothing. The whole section is conditional on having a
non-null `history` value. No spinner — the listing page is functional without it
and a flash of loading state in a side panel is more annoying than useful.

### i18n

Add to `App/Shopper/messages/en.json` and `messages/es.json`:

```
"History": {
  "title": "History" / "Historia",
  "disclaimer": "AI-generated. See sources." / "Generado por IA. Ver fuentes."
}
```

---

## 6. Testing strategy

### KitHistoryMS unit + integration tests

| File | What it covers | How it mocks |
|---|---|---|
| `test/embed.test.ts` | Embedding wrapper handles batching, retries, dim mismatch | mock `fetch` to Gemini endpoint |
| `test/retrieve.test.ts` | ANN search returns top-K with metadata | **real Postgres + pgvector**, seeded with 50 synthetic chunks |
| `test/promptAssembly.test.ts` | Builds the assemble-context prompt; respects token budget; renumbers citations | pure unit, no I/O |
| `test/hallucinationGuards.test.ts` | A response that cites an index not in the retrieved set is rejected and the route returns 503 | feed fake model output |
| `test/history.endpoint.test.ts` | `GET /listings/:id/history` happy path with cached row | seeded `kithistory.listing_history`, no Gemini call |
| `test/history.coldMiss.endpoint.test.ts` | Cold miss: fetches listing, extracts (stub), retrieves, generates (stub), writes cache | stubs Gemini wrapper, real Postgres + Kit_ListingMS mocked via msw |
| `test/refresh.endpoint.test.ts` | `POST /listings/:id/refresh` JWE-gated; bypasses cache | reuses the existing `sessionMock` pattern |
| `test/extractEntities.test.ts` | Title-to-entities returns sane structure or all-null | stubbed Gemini |

Conventions match the Kit_ListingMS pattern: `vitest.setup.ts` seeds schema +
test data, tests use `pool` from `src/db.ts`. Gemini and any other LLM call
goes through a `src/llm.ts` adapter that's easily mockable via
`vi.spyOn(globalThis, 'fetch')`.

### Prompt assembly + hallucination guards (specifically)

These are the testable units that protect us from the LLM going off-rail:

- `assemblePrompt(entities, chunks)` — pure function; tested for token budget
  truncation, citation renumbering, deterministic chunk order, and refusal when
  zero relevant chunks were retrieved.
- `validateCitations(modelOutput, retrievedChunkIds)` — pure function; rejects
  if any cited index references a chunk that wasn't in the retrieved set or if
  any sentence with a noun phrase lacks a citation.

Both must have 100% line + branch coverage; they are the safety boundary.

### Marketplace side

- **Shopper tests do not start KitHistoryMS.** The `service.ts` is the
  injection seam: `App/Shopper/test/kithistory/getListingHistory.service.test.tsx`
  mocks `fetch` and asserts (a) timeout returns null, (b) 503 returns null,
  (c) valid response returns parsed shape.
- **`viewlisting` page tests** mock the server action via Vitest's
  `vi.mock('../../kithistory/actions', ...)` and assert:
  - History section renders when action returns a value
  - History section is **absent** when action returns null
  - History section is absent when action throws
- **No msw handler for kithistory in the global `mswServer.ts`** — explicit
  per-test mocking keeps the global test setup uncoupled from this service.
- **No coverage cost** to the marketplace: the wrapper module is small (<50 LOC)
  and fully covered by the targeted tests above.

### CI

Add `.gitlab-ci.yml` entries:

```yaml
check:kithistory-ms:
  extends: .check_template
  variables:
    APP_DIR: App/KitHistoryMS

test:kithistory-ms:
  extends: .test_template
  variables:
    APP_DIR: App/KitHistoryMS
    # no Gemini key in CI — tests must work offline
```

The pipeline's postgres service needs the pgvector extension. Since
`.test_template` uses `postgres:16`, override it to
`pgvector/pgvector:pg16` in the kithistory test job.

---

## 7. Risks and open questions

### Real risks

- **pgvector image swap may force a data volume reset** on every dev machine
  the first time they pull. Worth a heads-up in the team meeting and a
  one-paragraph migration note in `README.md`. Not blocking; the existing
  flow already loses data on first compose.
- **Token budget for Wikipedia chunks**: a Wikipedia season page can be 30k
  tokens. Naive embedding-per-paragraph blows up the chunk count. The chunking
  config above (500 tok + 60 overlap) caps each source at ~50–80 chunks; needs
  to be enforced in the ingest script with a per-source ceiling.
- **Gemini rate limits in dev**: the free tier is 15 RPM for Flash. The
  ingest script's batch-of-100 embedding call eats requests; budget for the
  initial ingest to take ~10 minutes. Production-fine.
- **Entity extraction will be wrong for vague titles** like `"Random Jersey"`
  in the seed. The extractor must allow nullable fields, and the endpoint
  must return 404 (no useful history) instead of generating nonsense from
  empty entities.
- **Citations must be checkable**: rendering `[1]` is one click away from
  reading the source. If a user clicks and the cited page doesn't contain the
  claim, that's a quality bug we won't catch in CI. Add a `scripts/audit.ts`
  that LLM-checks 50 cached summaries against their citations weekly.
- **Hardcoded `localhost:30XX` in the Shopper service layer** — this is the
  same debt called out in the audit. The kithistory service.ts uses an env var
  to set the right example.

### Open questions for you

These need a call before code lands. The next section quotes them again with
context.

1. LLM provider — Gemini, Claude, OpenAI? Affects keys, embed dimension, schema
   for `kithistory.chunk.embedding`, runtime cost, and which adapter goes in
   `src/llm.ts`.
2. Structured entity strategy — auto-extract only (option 1 in §2), or expand
   the seller form (option 2)? Auto-only is faster; form-based is more
   accurate.
3. Postgres image swap to `pgvector/pgvector:pg16-alpine` — OK to take that
   change in this PR, or split into a separate "infra" PR for the team meeting?

### Minor open questions

- Caching invalidation on listing edit: should Kit_ListingMS notify Historian
  on update? Or is the lazy `content_hash` check on next read enough? I lean
  on lazy — no cross-service coupling for a non-critical signal.
- Should the History section be cacheable at the CDN/nginx layer? Not for the
  capstone; the Postgres cache is fast enough.
- Admin UI for source list management? Nice-to-have; out of scope here.

---

## Decisions (resolved 2026-06-07)

1. **LLM provider — Gemini.** Flash for generation, `text-embedding-004`
   for embeddings (768 dims). Schema's `vector(768)` and `HISTORY_EMBED_MODEL`
   default already match.

2. **Listing-entity source — sellers fill structured fields (default),
   auto-extract as fallback.** See §2 above. Implemented as commit 2 of the
   rollout, on top of the KitHistoryMS scaffold.

3. **Postgres image swap** — still **open**. Need to decide whether the
   `postgres:alpine → pgvector/pgvector:pg16-alpine` change lands inside the
   KitHistoryMS PR (one big change, one heads-up) or in a standalone infra
   PR + Slack message first (cleaner, more rituals). My weak recommendation:
   bundle it — the team is already used to `docker compose down -v` from this
   project's existing rough edges, and one PR is less coordination overhead.
