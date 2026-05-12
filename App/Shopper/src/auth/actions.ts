'use server'

import { cookies } from 'next/headers'
import { AuthService } from './service'
import { SessionUser } from '.'

export async function getSessionUser(): Promise<SessionUser | undefined> {
  const token = (await cookies()).get('session')?.value
  if (!token) return undefined
  return new AuthService().check(token)
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
