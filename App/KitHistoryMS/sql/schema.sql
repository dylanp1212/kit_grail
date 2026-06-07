-- KitHistoryMS schema. Lives in its own `kithistory` schema so it neither
-- collides with nor depends on the marketplace tables. Uses pgvector for
-- similarity search over Wikipedia chunk embeddings.

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS kithistory;

DROP TABLE IF EXISTS kithistory.listing_history CASCADE;
DROP TABLE IF EXISTS kithistory.chunk CASCADE;
DROP TABLE IF EXISTS kithistory.source CASCADE;

-- One row per Wikipedia (or other) page we've ingested.
CREATE TABLE kithistory.source (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url         TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  fetched_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  data        jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Chunks of a source, each with its embedding vector.
-- 768 dims matches Gemini text-embedding-004.
CREATE TABLE kithistory.chunk (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id   UUID NOT NULL REFERENCES kithistory.source(id) ON DELETE CASCADE,
  ordinal     INT NOT NULL,
  text        TEXT NOT NULL,
  embedding   vector(768) NOT NULL,
  data        jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (source_id, ordinal)
);

-- No ivfflat index: at our scale (5-15k chunks) a sequential scan with
-- cosine distance is ~10ms, and ivfflat's default `probes = 1` was
-- silently dropping legitimate matches in tests. Add the index back
-- (and `SET ivfflat.probes = 10` per session) once the corpus grows
-- enough for sequential scan to hurt.

-- Per-listing cached history. Keyed by listing_id (no FK to kit_listing —
-- KitHistoryMS shouldn't cascade-couple to the marketplace DB).
-- content_hash invalidates the cache when title/description/entities change.
CREATE TABLE kithistory.listing_history (
  listing_id    UUID PRIMARY KEY,
  content_hash  TEXT NOT NULL,
  entities      jsonb NOT NULL,
  summary       TEXT NOT NULL,
  citations     jsonb NOT NULL,
  generated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  data          jsonb NOT NULL DEFAULT '{}'::jsonb
);
