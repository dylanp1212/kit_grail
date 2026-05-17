export interface CheckoutItem {
  title: string
  price: number
  image?: string
}

export interface CheckoutSessionRequest {
  shopperid: string
  items: CheckoutItem[]
  successUrl: string
  cancelUrl: string
}

export interface CheckoutSessionResponse {
  url: string
}
