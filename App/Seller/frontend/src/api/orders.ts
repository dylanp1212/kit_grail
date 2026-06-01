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

/**
 * Fetches all orders for the current seller (from the session cookie).
 * @returns {Promise<SellerOrder[]>} A promise resolving to an array of orders.
 */
export async function getOrders(): Promise<SellerOrder[]> {
  const res = await fetch('/api/v0/my-orders');
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}
