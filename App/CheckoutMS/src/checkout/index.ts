export interface CheckoutItem {
  id: string
  title: string
  price: number
  image?: string
}

export interface SellerOrderItem {
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
  items: SellerOrderItem[]
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

export interface ShopperOrderItem {
  id: string
  kit_listing: string
  title: string
  price: number
}

export interface ShopperOrder {
  id: string
  status: string
  paid_at: string
  items: ShopperOrderItem[]
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

export interface OrdersPerDay {
  day: string
  count: number
  total: number
}
