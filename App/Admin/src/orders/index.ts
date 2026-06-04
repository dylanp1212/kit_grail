export interface OrderItem {
  id: string
  kit_listing: string
  title: string
  price: number
}

export interface SellerOrder {
  id: string
  shopper: string
  shopper_name?: string
  shopper_email?: string
  status: string
  paid_at: string
  items: OrderItem[]
}

export interface DetailedSellerOrder extends SellerOrder {
  seller_name: string
  seller_email: string
}

export interface FullOrderItem {
  id: string
  kit_listing: string
  title: string
  price: number
  seller_id: string
  seller_name: string
  seller_email: string
}

export interface FullOrder {
  id: string
  status: string
  paid_at: string
  total: number
  shopper_id: string
  shopper_name: string
  shopper_email: string
  items: FullOrderItem[]
}
