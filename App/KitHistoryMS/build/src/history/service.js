"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryService = void 0;
const db_1 = require("../db");
class HistoryService {
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
}
exports.HistoryService = HistoryService;
