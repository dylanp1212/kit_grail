'use server'

import {cookies} from 'next/headers'

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL ?? 'http://localhost:3010'

async function authHeaders(): Promise<Record<string, string>> {
  const token = (await cookies()).get('session')?.value
  return token ? {Authorization: `Bearer ${token}`} : {}
}

export async function getProfilePicture(): Promise<string | undefined> {
  const res = await fetch(`${AUTH_SERVICE_URL}/api/v0/profile/picture`, {
    headers: await authHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) return undefined
  const body = await res.json() as {picture?: string}
  return body.picture
}

export async function updateProfilePicture(url: string): Promise<boolean> {
  const res = await fetch(`${AUTH_SERVICE_URL}/api/v0/profile/picture`, {
    method: 'PUT',
    headers: {...await authHeaders(), 'Content-Type': 'application/json'},
    body: JSON.stringify({url}),
  })
  return res.ok
}
