export interface OrderItem {
  id: string
  kit_listing: string
  title: string
  price: number
}

export interface SellerOrder {
  id: string
  shopper: string
  status: string
  paid_at: string
  items: OrderItem[]
}
