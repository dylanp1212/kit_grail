import { Authenticated, ExchangeRequest, SessionUser } from '.'

function authServiceUrl(): string {
  return process.env.AUTH_SERVICE_URL ?? 'http://localhost:3010'
}

export class AuthService {
  public async exchangeGoogle(
    code: string,
    redirectUri: string,
  ): Promise<Authenticated | undefined> {
    const body: ExchangeRequest = { code, redirectUri }
    const response = await fetch(`${authServiceUrl()}/api/v0/auth/google/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      return undefined
    }
    return (await response.json()) as Authenticated
  }

  public async check(accessToken: string): Promise<SessionUser | undefined> {
    const response = await fetch(`${authServiceUrl()}/api/v0/check`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!response.ok) {
      return undefined
    }
    return (await response.json()) as SessionUser
  }
}
