export interface SessionUser {
  id: string
  email: string
  name: string
  role: 'shopper' | 'seller'
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

/**
 *
 */
export async function getProfilePicture(): Promise<string | undefined> {
  const res = await fetch('/api/v0/auth/profile/picture');
  if (!res.ok) return undefined;
  const body = await res.json() as {picture?: string};
  return body.picture;
}
