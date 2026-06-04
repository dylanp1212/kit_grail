import { Seller } from '.'

const AUTH_MS = 'http://localhost:3010/api/v0'

export class SellerService {
  public async getAllSellers(): Promise<Seller[]> {
    const res = await fetch(`${AUTH_MS}/sellers`)
    if (!res.ok) throw new Error(`Failed to fetch sellers: ${res.status}`)
    return res.json() as Promise<Seller[]>
  }

  public async setSuspended(id: string, suspended: boolean): Promise<void> {
    const res = await fetch(`${AUTH_MS}/sellers/${encodeURIComponent(id)}/suspended`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suspended }),
    })
    if (!res.ok) throw new Error(`Failed to update seller: ${res.status}`)
  }
}
