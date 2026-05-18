import {beforeAll, afterAll} from 'vitest'
import * as http from 'http'
import supertest from 'supertest'
import app, { bootstrap } from '../src/app'
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
  await pool.query('CREATE EXTENSION IF NOT EXISTS pgcrypto')
  const schema = readFileSync('../Shopper/sql/schema.sql', 'utf-8')
  await pool.query(schema)
  const data = readFileSync('../Shopper/sql/data.sql', 'utf-8')
  await pool.query(data)
  await pool.end()
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

// graphql helper function for testing
export const gql = (query: string, variables?: Record<string, unknown>) =>
  supertest(server)
    .post('/graphql')
    .set('Content-Type', 'application/json')
    .send({ query, variables })
