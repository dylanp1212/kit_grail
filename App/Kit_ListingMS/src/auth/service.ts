import { pool } from '../db'
import { AuthSeller } from '.'
import { getPrefix, verifyKey } from './apiKey'

interface KeyRow {
  seller: string
  hash: string
}

export class ApiKeyService {
  public async lookup(authHeader?: string): Promise<AuthSeller> {
    if (!authHeader) {
      throw new Error('Unauthorized')
    }
    const key = authHeader.split(' ')[1]
    if (!key) {
      throw new Error('Unauthorized')
    }
    const prefix = getPrefix(key)
    const res = await pool.query<KeyRow>(
      `SELECT seller, data->>'hash' AS hash FROM api_key
       WHERE data->>'prefix' = $1 AND (data->>'revoked_at') IS NULL
       LIMIT 1`,
      [prefix],
    )
    if (res.rowCount === 0) {
      throw new Error('Unauthorized')
    }
    const ok = await verifyKey(key, res.rows[0].hash)
    if (!ok) {
      throw new Error('Unauthorized')
    }
    return { id: res.rows[0].seller }
  }
}
