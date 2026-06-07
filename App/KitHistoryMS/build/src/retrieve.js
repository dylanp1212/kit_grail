"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveTopK = retrieveTopK;
const db_1 = require("./db");
async function retrieveTopK(queryEmbedding, k = 8) {
    const res = await db_1.pool.query(`SELECT
       c.id,
       c.source_id,
       s.url   AS source_url,
       s.title AS source_title,
       c.ordinal,
       c.text,
       c.embedding <=> $1::vector AS distance
     FROM kithistory.chunk c
     JOIN kithistory.source s ON s.id = c.source_id
     ORDER BY c.embedding <=> $1::vector
     LIMIT $2`, [`[${queryEmbedding.join(',')}]`, k]);
    return res.rows;
}
