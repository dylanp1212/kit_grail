"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JweAuthService = void 0;
const authServiceUrl = () => process.env.AUTH_SERVICE_URL ?? 'http://localhost:3010';
class JweAuthService {
    async lookup(authHeader) {
        if (!authHeader) {
            throw new Error('Unauthorized');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new Error('Unauthorized');
        }
        const res = await fetch(`${authServiceUrl()}/api/v0/check`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
            throw new Error('Unauthorized');
        }
        const user = (await res.json());
        if (user.role !== 'seller') {
            throw new Error('Unauthorized');
        }
        return { id: user.id };
    }
}
exports.JweAuthService = JweAuthService;
