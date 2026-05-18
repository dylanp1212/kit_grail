"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSellerAuth = requireSellerAuth;
const service_1 = require("./service");
async function requireSellerAuth(req, res, next) {
    const token = req.cookies?.seller_session;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        req.user = await new service_1.AuthService().check(token);
        next();
    }
    catch {
        res.status(401).json({ message: 'Unauthorized' });
    }
}
