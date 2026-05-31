'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthService } from './service'
import { SessionUser } from '.'

const SESSION_COOKIE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 2 * 60 * 60,
  path: '/',
}

export async function loginAdmin(email: string, password: string): Promise<string | undefined> {
  const authenticated = await new AuthService().loginAdmin(email, password)
  if (!authenticated) return 'Invalid email or password'
  const cookieStore = await cookies()
  cookieStore.set('admin_session', authenticated.accessToken, SESSION_COOKIE)
  redirect('/')
}

export async function getSessionUser(): Promise<SessionUser | undefined> {
  const token = (await cookies()).get('admin_session')?.value
  if (!token) return undefined
  return new AuthService().check(token)
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/login')
}
