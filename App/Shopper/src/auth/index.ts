export interface SessionUser {
  id: string
  email: string
  name: string
  role: 'shopper' | 'seller'
}

export interface Authenticated {
  name: string
  accessToken: string
}

export type SellerExchangeResult = Authenticated | 'suspended' | undefined

export interface ExchangeRequest {
  code: string
  redirectUri: string
}
