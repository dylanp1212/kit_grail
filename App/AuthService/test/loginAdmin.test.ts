import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'

import app from '../src/app'
import { pool } from '../src/db'
import { AuthService } from '../src/auth/service'

const ADMIN_ID = '99999999-9999-9999-9999-999999999999'
const ADMIN_EMAIL = 'admin@kg.test'
const ADMIN_PASSWORD = 'super-secret-123'

beforeAll(async () => {
  await pool.query(`DELETE FROM administrator WHERE id = $1`, [ADMIN_ID])
  await pool.query(
    `INSERT INTO administrator(id, data)
     VALUES ($1, jsonb_build_object(
       'email', $2::text,
       'name', 'Test Admin',
       'pwhash', crypt($3::text, gen_salt('bf'))
     ))`,
    [ADMIN_ID, ADMIN_EMAIL, ADMIN_PASSWORD],
  )
})

afterAll(async () => {
  await pool.query(`DELETE FROM administrator WHERE id = $1`, [ADMIN_ID])
  await pool.end()
})

describe('POST /api/v0/auth/admin/login', () => {
  it('returns 200 with an accessToken on valid credentials', async () => {
    const res = await request(app)
      .post('/api/v0/auth/admin/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      .expect(200)
    expect(res.body.name).toBe('Test Admin')
    expect(typeof res.body.accessToken).toBe('string')
    expect(res.body.accessToken.length).toBeGreaterThan(0)
  })

  it('issued token has role=administrator and the admin id', async () => {
    const res = await request(app)
      .post('/api/v0/auth/admin/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      .expect(200)
    const user = await new AuthService().check(`Bearer ${String(res.body.accessToken)}`)
    expect(user.role).toBe('administrator')
    expect(user.id).toBe(ADMIN_ID)
    expect(user.email).toBe(ADMIN_EMAIL)
    expect(user.name).toBe('Test Admin')
  })

  it('returns 401 on wrong password', async () => {
    await request(app)
      .post('/api/v0/auth/admin/login')
      .send({ email: ADMIN_EMAIL, password: 'wrong' })
      .expect(401)
  })

  it('returns 401 on unknown email', async () => {
    await request(app)
      .post('/api/v0/auth/admin/login')
      .send({ email: 'nobody@kg.test', password: ADMIN_PASSWORD })
      .expect(401)
  })
})
