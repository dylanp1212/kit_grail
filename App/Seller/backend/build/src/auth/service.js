"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const authServiceUrl = () => process.env.AUTH_SERVICE_URL ?? 'http://localhost:3010';
class AuthService {
    async exchangeGoogleSeller(code, redirectUri) {
        const res = await fetch(`${authServiceUrl()}/api/v0/auth/google/exchange/seller`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, redirectUri }),
        });
        if (res.status === 403)
            return 'suspended';
        if (!res.ok)
            return undefined;
        return res.json();
    }
    async check(token) {
        const res = await fetch(`${authServiceUrl()}/api/v0/check`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok)
            throw new Error('Unauthorized');
        return res.json();
    }
}
exports.AuthService = AuthService;
