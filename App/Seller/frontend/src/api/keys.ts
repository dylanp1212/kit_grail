export interface KeyMetadata {
  id: string;
  prefix: string;
  label?: string;
  created_at?: string;
  revoked_at?: string;
}

export interface KeyCreated {
  id: string;
  prefix: string;
  plaintext: string;
  label: string;
  created_at: string;
}

/**
 *
 */
export async function listKeys(): Promise<KeyMetadata[]> {
  const res = await fetch('/api/v0/keys', {credentials: 'include'});
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}

/**
 *
 * @param label
 */
export async function createKey(label: string): Promise<KeyCreated> {
  const res = await fetch('/api/v0/keys', {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({label}),
  });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}

/**
 *
 * @param id
 */
export async function revokeKey(id: string): Promise<void> {
  const res = await fetch(`/api/v0/keys/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
}
