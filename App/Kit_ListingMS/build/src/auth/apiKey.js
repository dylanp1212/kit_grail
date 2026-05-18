"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKey = generateKey;
exports.getPrefix = getPrefix;
exports.hashKey = hashKey;
exports.verifyKey = verifyKey;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const KEY_PREFIX = 'kg_';
const SECRET_BYTES = 30;
const PREFIX_LENGTH = 12;
const BCRYPT_COST = 10;
function generateKey() {
    return KEY_PREFIX + crypto_1.default.randomBytes(SECRET_BYTES).toString('base64url');
}
function getPrefix(key) {
    return key.slice(0, PREFIX_LENGTH);
}
async function hashKey(key) {
    return bcryptjs_1.default.hash(key, BCRYPT_COST);
}
async function verifyKey(key, hash) {
    return bcryptjs_1.default.compare(key, hash);
}
