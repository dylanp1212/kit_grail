"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyManagementService = void 0;
const db_1 = require("../db");
const apiKey_1 = require("../auth/apiKey");
class KeyManagementService {
    async create(sellerId, req) {
        const plaintext = (0, apiKey_1.generateKey)();
        const prefix = (0, apiKey_1.getPrefix)(plaintext);
        const hash = await (0, apiKey_1.hashKey)(plaintext);
        const created_at = new Date().toISOString();
        const res = await db_1.pool.query(`INSERT INTO api_key(seller, prefix, hash, data)
       VALUES ($1, $2, $3, $4::jsonb)
       RETURNING id`, [sellerId, prefix, hash, JSON.stringify({ label: req.label, created_at })]);
        return { id: res.rows[0].id, prefix, plaintext, label: req.label, created_at };
    }
    async list(sellerId) {
        const res = await db_1.pool.query(`SELECT id, prefix, data FROM api_key
       WHERE seller = $1
       ORDER BY (data->>'created_at') DESC NULLS LAST`, [sellerId]);
        return res.rows.map((row) => ({
            id: row.id,
            prefix: row.prefix,
            label: row.data?.label,
            created_at: row.data?.created_at,
            revoked_at: row.data?.revoked_at,
        }));
    }
    async revoke(sellerId, keyId) {
        const res = await db_1.pool.query(`UPDATE api_key
       SET data = data || jsonb_build_object('revoked_at', to_jsonb($1::text))
       WHERE id = $2 AND seller = $3 AND (data->>'revoked_at') IS NULL`, [new Date().toISOString(), keyId, sellerId]);
        return (res.rowCount ?? 0) > 0;
    }
}
exports.KeyManagementService = KeyManagementService;
