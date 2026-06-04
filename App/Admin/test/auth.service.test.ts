import {it, expect} from 'vitest'
import {http, HttpResponse} from 'msw'
import {AuthService} from '../src/auth/service'
import {server} from './mswServer'

const AUTH_MS = 'http://localhost:3010/api/v0'

it('loginAdmin returns authenticated on success', async () => {
  const result = await new AuthService().loginAdmin('admin@example.com', 'password')
  expect(result).toEqual({name: 'Admin', accessToken: 'test-token'})
})

it('loginAdmin returns undefined on failure', async () => {
  server.use(http.post(`${AUTH_MS}/auth/admin/login`, () => new HttpResponse(null, {status: 401})))
  const result = await new AuthService().loginAdmin('admin@example.com', 'wrong')
  expect(result).toBeUndefined()
})

it('check returns session user with valid token', async () => {
  const result = await new AuthService().check('test-token')
  expect(result).toMatchObject({email: 'admin@example.com', role: 'administrator'})
})

it('check returns undefined with invalid token', async () => {
  server.use(http.get(`${AUTH_MS}/check`, () => new HttpResponse(null, {status: 401})))
  const result = await new AuthService().check('bad-token')
  expect(result).toBeUndefined()
})
