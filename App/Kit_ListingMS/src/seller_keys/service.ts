import { pool } from '../db'
import { generateKey, getPrefix, hashKey } from '../auth/apiKey'
import { CreateKeyRequest, KeyCreated, KeyMetadata } from '.'

interface KeyRow {
  id: string
  prefix: string
  data: {
    label?: string
    created_at?: string
    revoked_at?: string
  } | null
}

export class KeyManagementService {
  public async create(sellerId: string, req: CreateKeyRequest): Promise<KeyCreated> {
    const plaintext = generateKey()
    const prefix = getPrefix(plaintext)
    const hash = await hashKey(plaintext)
    const created_at = new Date().toISOString()
    const res = await pool.query<{ id: string }>(
      `INSERT INTO api_key(seller, prefix, hash, data)
       VALUES ($1, $2, $3, $4::jsonb)
       RETURNING id`,
      [sellerId, prefix, hash, JSON.stringify({ label: req.label, created_at })],
    )
    return { id: res.rows[0].id, prefix, plaintext, label: req.label, created_at }
  }

  public async list(sellerId: string): Promise<KeyMetadata[]> {
    const res = await pool.query<KeyRow>(
      `SELECT id, prefix, data FROM api_key
       WHERE seller = $1
       ORDER BY (data->>'created_at') DESC NULLS LAST`,
      [sellerId],
    )
    return res.rows.map((row) => ({
      id: row.id,
      prefix: row.prefix,
      label: row.data?.label,
      created_at: row.data?.created_at,
      revoked_at: row.data?.revoked_at,
    }))
  }

  public async revoke(sellerId: string, keyId: string): Promise<boolean> {
    const res = await pool.query(
      `UPDATE api_key
       SET data = data || jsonb_build_object('revoked_at', to_jsonb($1::text))
       WHERE id = $2 AND seller = $3 AND (data->>'revoked_at') IS NULL`,
      [new Date().toISOString(), keyId, sellerId],
    )
    return !!res.rowCount
  }
}
