import 'dotenv/config'
import {beforeAll} from 'vitest'
import {Pool} from 'pg'
import {readFileSync} from 'fs'

beforeAll(async () => {
  const setupPool = new Pool({
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  })
  const schema = readFileSync('./sql/schema.sql', 'utf-8')
  await setupPool.query(schema)
  await setupPool.end()
})
