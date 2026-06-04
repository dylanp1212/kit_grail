import {it, expect, vi} from 'vitest'
import {http, HttpResponse} from 'msw'
import {loginAdmin, getSessionUser, signOut} from '../src/auth/actions'
import {server} from './mswServer'
import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'

const AUTH_MS = 'http://localhost:3010/api/v0'

it('loginAdmin sets cookie and redirects on success', async () => {
  const cookieStore = await cookies()
  await loginAdmin('admin@example.com', 'password')
  expect(cookieStore.set).toHaveBeenCalledWith('admin_session', 'test-token', expect.any(Object))
  expect(redirect).toHaveBeenCalledWith('/')
})

it('loginAdmin returns error string on failure', async () => {
  server.use(http.post(`${AUTH_MS}/auth/admin/login`, () => new HttpResponse(null, {status: 401})))
  const result = await loginAdmin('admin@example.com', 'wrong')
  expect(result).toBe('Invalid email or password')
})

it('getSessionUser returns user when cookie exists', async () => {
  const user = await getSessionUser()
  expect(user).toMatchObject({email: 'admin@example.com', role: 'administrator'})
})

it('getSessionUser returns undefined when no cookie', async () => {
  vi.mocked(cookies).mockResolvedValueOnce({
    get: vi.fn().mockReturnValue(undefined),
    set: vi.fn(),
    delete: vi.fn(),
  } as any)
  const user = await getSessionUser()
  expect(user).toBeUndefined()
})

it('signOut deletes cookie and redirects to login', async () => {
  const cookieStore = await cookies()
  await signOut()
  expect(cookieStore.delete).toHaveBeenCalledWith('admin_session')
  expect(redirect).toHaveBeenCalledWith('/login')
})
