"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryService = void 0;
const crypto_1 = require("crypto");
const db_1 = require("../db");
const llm_1 = require("../llm");
const listing_1 = require("../listing");
const retrieve_1 = require("../retrieve");
const prompt_1 = require("../prompt");
const validate_1 = require("../validate");
class HistoryService {
    llm;
    fetchListingFn;
    retrieveFn;
    constructor(deps = {}) {
        this.llm = deps.llm ?? new llm_1.LlmClient();
        this.fetchListingFn = deps.fetchListingFn ?? listing_1.fetchListing;
        this.retrieveFn = deps.retrieveFn ?? retrieve_1.retrieveTopK;
    }
    async getCached(listingId) {
        const res = await db_1.pool.query(`SELECT summary, citations, generated_at
       FROM kithistory.listing_history
       WHERE listing_id = $1
       LIMIT 1`, [listingId]);
        if (res.rowCount === 0)
            return null;
        const row = res.rows[0];
        return {
            summary: row.summary,
            citations: row.citations,
            generated_at: row.generated_at.toISOString(),
            cached: true,
        };
    }
    async generateForListing(listingId) {
        const listing = await this.fetchListingFn(listingId);
        if (!listing)
            return null;
        const query = (0, listing_1.retrievalQuery)(listing);
        const queryEmbedding = await this.llm.embed(query);
        const chunks = await this.retrieveFn(queryEmbedding, 8);
        if (chunks.length === 0)
            return null;
        const prompt = (0, prompt_1.assemblePrompt)({ listing, chunks });
        const modelOutput = await this.llm.generate(prompt);
        const validation = (0, validate_1.validateCitations)(modelOutput, chunks);
        if (!validation.ok) {
            throw new Error(`Citation validation failed: ${validation.reason ?? 'unknown'}`);
        }
        const citations = modelOutput.citations.map((c) => {
            const chunk = chunks[c.index - 1];
            return { index: c.index, url: chunk.source_url, title: chunk.source_title };
        });
        const result = {
            summary: modelOutput.summary,
            citations,
            generated_at: new Date().toISOString(),
            cached: false,
        };
        await this.cache(listingId, listing, result);
        return result;
    }
    async cache(listingId, listing, result) {
        const contentHash = (0, crypto_1.createHash)('sha256')
            .update(`${listing.title}|${listing.description}`)
            .digest('hex');
        await db_1.pool.query(`INSERT INTO kithistory.listing_history
         (listing_id, content_hash, entities, summary, citations)
       VALUES ($1, $2, '{}'::jsonb, $3, $4::jsonb)
       ON CONFLICT (listing_id) DO UPDATE
         SET content_hash = EXCLUDED.content_hash,
             summary      = EXCLUDED.summary,
             citations    = EXCLUDED.citations,
             generated_at = now()`, [listingId, contentHash, result.summary, JSON.stringify(result.citations)]);
    }
}
exports.HistoryService = HistoryService;
