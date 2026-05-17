import {Pool} from 'pg'

export const pool = new Pool({
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: Number(process.env.POSTGRES_PORT ?? 5434),
  database: process.env.POSTGRES_DB ?? 'checkout',
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
})
