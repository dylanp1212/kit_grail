import { pool } from '../src/db'
import { generateKey, getPrefix, hashKey } from '../src/auth/apiKey'

export interface TestSeller {
  id: string
  key: string
}

export async function createTestSeller(email: string, name: string): Promise<TestSeller> {
  const res = await pool.query<{ id: string }>(
    `INSERT INTO seller(data) VALUES ($1::jsonb) RETURNING id`,
    [JSON.stringify({ email, name })],
  )
  const id = res.rows[0].id
  const key = generateKey()
  await pool.query(
    `INSERT INTO api_key(seller, data) VALUES ($1, $2::jsonb)`,
    [id, JSON.stringify({ prefix: getPrefix(key), hash: await hashKey(key) })],
  )
  return { id, key }
}

export async function deleteTestSeller(id: string): Promise<void> {
  await pool.query(`DELETE FROM seller WHERE id = $1`, [id])
}
