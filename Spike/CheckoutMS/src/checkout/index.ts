export interface LineItem {
  title: string
  price: number
  image?: string
}

export interface CheckoutSessionRequest {
  shopperid: string
  items: LineItem[]
  successUrl: string
  cancelUrl: string
}

export interface CheckoutSessionResponse {
  url: string
}
