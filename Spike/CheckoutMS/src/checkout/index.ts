export interface LineItem {
  title: string
  price: number
  image?: string
}

export interface CheckoutSessionRequest {
  items: LineItem[]
  successUrl: string
  cancelUrl: string
}

export interface CheckoutSessionResponse {
  url: string
}
