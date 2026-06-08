export interface OrderItem {
  id: string
  kit_listing: string
  title: string
  price: number
}

export interface ShippingAddress {
  name?: string
  address?: {
    line1?: string
    line2?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
  }
}

export interface SellerOrder {
  id: string
  shopper: string
  shopper_name?: string
  shopper_email?: string
  status: string
  paid_at: string
  shipping?: ShippingAddress
  items: OrderItem[]
}
