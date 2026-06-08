"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyService = void 0;
const db_1 = require("../db");
const apiKey_1 = require("./apiKey");
class ApiKeyService {
    async lookup(authHeader) {
        if (!authHeader) {
            throw new Error('Unauthorized');
        }
        const key = authHeader.split(' ')[1];
        if (!key) {
            throw new Error('Unauthorized');
        }
        const prefix = (0, apiKey_1.getPrefix)(key);
        const res = await db_1.pool.query(`SELECT seller, data->>'hash' AS hash FROM api_key
       WHERE data->>'prefix' = $1 AND (data->>'revoked_at') IS NULL
       LIMIT 1`, [prefix]);
        if (res.rowCount === 0) {
            throw new Error('Unauthorized');
        }
        const ok = await (0, apiKey_1.verifyKey)(key, res.rows[0].hash);
        if (!ok) {
            throw new Error('Unauthorized');
        }
        return { id: res.rows[0].seller };
    }
}
exports.ApiKeyService = ApiKeyService;
