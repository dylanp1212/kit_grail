export interface SessionUser {
  id: string
  email: string
  name: string
}

/**
 *
 */
export async function getSession(): Promise<SessionUser | null> {
  const res = await fetch('/api/v0/auth/me');
  if (!res.ok) return null;
  return res.json();
}

/**
 *
 */
export async function signOut(): Promise<void> {
  await fetch('/api/v0/auth/signout', {method: 'POST'});
}
