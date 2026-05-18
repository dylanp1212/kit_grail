'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function toggleLocale() {
  const cookieStore = await cookies()
  const current = cookieStore.get('locale')?.value ?? 'en'
  cookieStore.set('locale', current === 'en' ? 'sp' : 'en', { path: '/' })
  revalidatePath('/', 'layout')
}
