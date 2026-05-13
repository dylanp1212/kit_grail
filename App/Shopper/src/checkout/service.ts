export async function createCheckoutSession(
  shopperid: string,
  items: {title: string, price: number, image?: string}[],
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const res = await fetch('http://localhost:3013/api/v0/checkout/session', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({shopperid, items, successUrl, cancelUrl}),
  })
  const {url} = await res.json()
  return url
}
