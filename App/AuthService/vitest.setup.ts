import 'dotenv/config'
process.env.POSTGRES_DB = 'test'

import { beforeAll } from 'vitest'
import { Pool } from 'pg'
import { readFileSync } from 'fs'

beforeAll(async () => {
  const pool = new Pool({
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: 5432,
    database: 'test',
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  })
  const schema = readFileSync('../Shopper/sql/schema.sql', 'utf-8')
  await pool.query(schema)
  await pool.end()
})
