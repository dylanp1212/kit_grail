import { Authenticated, SessionUser } from '.'

const authServiceUrl = () => process.env.AUTH_SERVICE_URL ?? 'http://localhost:3010'

export class AuthService {
  public async exchangeGoogleSeller(code: string, redirectUri: string): Promise<Authenticated | undefined> {
    const res = await fetch(`${authServiceUrl()}/api/v0/auth/google/exchange/seller`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirectUri }),
    })
    if (!res.ok) return undefined
    return res.json() as Promise<Authenticated>
  }

  public async check(token: string): Promise<SessionUser> {
    const res = await fetch(`${authServiceUrl()}/api/v0/check`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('Unauthorized')
    return res.json() as Promise<SessionUser>
  }
}
