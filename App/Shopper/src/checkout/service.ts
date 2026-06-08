const CHECKOUT_MS_URL = 'http://localhost:3014/api/v0'

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

export async function getMyOrders(shopperid: string): Promise<ShopperOrder[]> {
  const res = await fetch(`${CHECKOUT_MS_URL}/checkout/orders/by-shopper?shopperid=${encodeURIComponent(shopperid)}`)
  return res.json() as Promise<ShopperOrder[]>
}

export async function createCheckoutSession(
  shopperid: string,
  items: {title: string, price: number, image?: string}[],
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  // const res = await fetch('/api/v0/checkout/session', { // production (nginx proxy)
  const res = await fetch(`${CHECKOUT_MS_URL}/checkout/session`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({shopperid, items, successUrl, cancelUrl}),
  })
  const body = await res.json() as {url?: string}
  if (!res.ok || !body.url) {
    throw new Error(`Checkout failed (${res.status}): ${JSON.stringify(body)}`)
  }
  return body.url
}
