"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeysService = void 0;
const MS_URL = process.env.KIT_LISTING_MS_URL ?? 'http://localhost:3011/api/v0';
class KeysService {
    async list(jwe) {
        const res = await fetch(`${MS_URL}/seller/keys`, {
            headers: { Authorization: `Bearer ${jwe}` },
        });
        if (!res.ok)
            throw new Error(`Failed: ${res.status}`);
        return res.json();
    }
    async create(jwe, body) {
        const res = await fetch(`${MS_URL}/seller/keys`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwe}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!res.ok)
            throw new Error(`Failed: ${res.status}`);
        return res.json();
    }
    async revoke(jwe, id) {
        const res = await fetch(`${MS_URL}/seller/keys/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${jwe}` },
        });
        return res.status === 204;
    }
}
exports.KeysService = KeysService;
