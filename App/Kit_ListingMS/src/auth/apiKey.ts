import crypto from 'crypto'
import bcrypt from 'bcryptjs'

const KEY_PREFIX = 'kg_'
const SECRET_BYTES = 30
const PREFIX_LENGTH = 12
const BCRYPT_COST = 10

export function generateKey(): string {
  return KEY_PREFIX + crypto.randomBytes(SECRET_BYTES).toString('base64url')
}

export function getPrefix(key: string): string {
  return key.slice(0, PREFIX_LENGTH)
}

export async function hashKey(key: string): Promise<string> {
  return bcrypt.hash(key, BCRYPT_COST)
}

export async function verifyKey(key: string, hash: string): Promise<boolean> {
  return bcrypt.compare(key, hash)
}
