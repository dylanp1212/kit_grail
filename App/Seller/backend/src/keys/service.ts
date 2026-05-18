import { CreateKeyRequest, KeyCreated, KeyMetadata } from '.'

const MS_URL = process.env.KIT_LISTING_MS_URL ?? 'http://localhost:3011/api/v0'

export class KeysService {
  public async list(jwe: string): Promise<KeyMetadata[]> {
    const res = await fetch(`${MS_URL}/seller/keys`, {
      headers: { Authorization: `Bearer ${jwe}` },
    })
    if (!res.ok) throw new Error(`Failed: ${res.status}`)
    return res.json() as Promise<KeyMetadata[]>
  }

  public async create(jwe: string, body: CreateKeyRequest): Promise<KeyCreated> {
    const res = await fetch(`${MS_URL}/seller/keys`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwe}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`Failed: ${res.status}`)
    return res.json() as Promise<KeyCreated>
  }

  public async revoke(jwe: string, id: string): Promise<boolean> {
    const res = await fetch(`${MS_URL}/seller/keys/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwe}` },
    })
    return res.status === 204
  }
}
