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

/**
 * Fetches all orders for the given seller.
 * @param {string} sellerID - The ID of the seller.
 * @returns {Promise<SellerOrder[]>} A promise resolving to an array of orders.
 */
export async function getOrders(sellerID: string): Promise<SellerOrder[]> {
  const res = await fetch(
      `/api/v0/my-orders?sellerID=${encodeURIComponent(sellerID)}`);
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}
