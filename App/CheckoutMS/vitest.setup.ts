import 'dotenv/config'
import {beforeAll, beforeEach, vi} from 'vitest'
import {Pool} from 'pg'
import {readFileSync} from 'fs'
import {pool} from './src/db'

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
  const setupPool = new Pool({
    host: 'localhost',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  })
  const schema = readFileSync('../Shopper/sql/schema.sql', 'utf-8')
  await setupPool.query(schema)
  const data = readFileSync('../Shopper/sql/data.sql', 'utf-8')
  await setupPool.query(data)
  await setupPool.end()
})

beforeEach(async () => {
  vi.restoreAllMocks()
  await pool.query(
    `UPDATE kit_listing SET data = jsonb_set(data, '{quantity}', '1') WHERE data ? 'quantity'`
  )
})
