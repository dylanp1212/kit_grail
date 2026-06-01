import 'dotenv/config'
import {beforeAll} from 'vitest'
import {Pool} from 'pg'
import {readFileSync} from 'fs'

export const SHOPPER_ID = 'e86405c1-545b-4bef-912c-a9b01ee6d18f'

export const fakeSession = (overrides?: {id?: string, metadata?: Record<string, string> | null}) => ({
  id: overrides?.id ?? `cs_test_${Date.now()}`,
  metadata: overrides?.metadata ?? {
    shopperid: SHOPPER_ID,
    items: JSON.stringify([
      {title: 'Messi Jersey', price: 99.99},
      {title: 'Italy Jersey', price: 134.00},
    ]),
  },
})

beforeAll(async () => {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  })
  // Minimal shopper table so the orders-by-listing query can LEFT JOIN it.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shopper (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      data jsonb NOT NULL DEFAULT '{}'::jsonb
    )
  `)
  const schema = readFileSync('./sql/schema.sql', 'utf-8')
  await pool.query(schema)
  await pool.end()
})
