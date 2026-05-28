import {beforeAll, beforeEach, afterAll} from 'vitest'
import * as http from 'http'
import supertest from 'supertest'
import app, { bootstrap } from '../src/app'
import { Pool } from 'pg'
import { readFileSync } from 'fs'

const pool = new Pool({
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: 5432,
  database: 'test',
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
})

beforeAll(async () => {
  await pool.query('CREATE EXTENSION IF NOT EXISTS pgcrypto')
  const schema = readFileSync('../Shopper/sql/schema.sql', 'utf-8')
  await pool.query(schema)
  const data = readFileSync('../Shopper/sql/data.sql', 'utf-8')
  await pool.query(data)
})

beforeEach(async () => {
  await pool.query('TRUNCATE shoppingcart')
  await pool.query(`DELETE FROM shopper WHERE data->>'is_guest' = 'true'`)
  await pool.query(`
    INSERT INTO shoppingcart(kit_listing, shopper, data)
    VALUES (
      'ad3852b2-2e1b-40e8-9400-668f6cfd2fe3',
      'e86405c1-545b-4bef-912c-a9b01ee6d18f',
      jsonb_build_object('added', '2026-05-01T07:30:00+00:00'::timestamptz)
    )
  `)
})

export let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>

beforeAll(async () => {
  await bootstrap()
  server = http.createServer(app)
  server.listen()
})

afterAll(() => {
  server.close()
})

export const gql = (query: string, variables?: Record<string, unknown>) =>
  supertest(server)
    .post('/graphql')
    .set('Content-Type', 'application/json')
    .send({ query, variables })
