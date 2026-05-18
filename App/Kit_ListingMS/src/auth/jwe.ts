import { AuthSeller } from '.'

interface SessionUser {
  id: string
  email?: string
  name?: string
}

const authServiceUrl = () => process.env.AUTH_SERVICE_URL ?? 'http://localhost:3010'

export class JweAuthService {
  public async lookup(authHeader?: string): Promise<AuthSeller> {
    if (!authHeader) {
      throw new Error('Unauthorized')
    }
    const token = authHeader.split(' ')[1]
    if (!token) {
      throw new Error('Unauthorized')
    }
    const res = await fetch(`${authServiceUrl()}/api/v0/check`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      throw new Error('Unauthorized')
    }
    const user = (await res.json()) as SessionUser
    return { id: user.id }
  }
}
