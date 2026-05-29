export async function createCheckoutSession(
  shopperid: string,
  items: {title: string, price: number, image?: string}[],
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const res = await fetch('/api/v0/checkout/session', {
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
