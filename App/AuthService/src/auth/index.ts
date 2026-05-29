export type Role = 'shopper' | 'seller'

export interface SessionUser {
  id: string
  email: string
  name: string
  role: Role
}

export interface Authenticated {
  name: string
  accessToken: string
}

export interface GoogleProfile {
  sub: string
  email: string
  name: string
}

export interface ExchangeRequest {
  code: string
  redirectUri: string
}
