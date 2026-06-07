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

CREATE INDEX IF NOT EXISTS chunk_embedding_ivfflat
  ON kithistory.chunk USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

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
