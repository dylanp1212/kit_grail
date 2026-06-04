export async function sendOrderConfirmation(
  to: string,
  items: {title: string, price: number}[],
): Promise<void> {
  const apiKey = process.env.MAILGUN_API_KEY!
  const domain = process.env.MAILGUN_DOMAIN!
  const total = items.reduce((sum, i) => sum + i.price, 0)

  const itemList = items
    .map(i => `  • ${i.title} — $${i.price.toFixed(2)}`)
    .join('\n')

  const form = new FormData()
  form.append('from', `Kit Grail <no-reply@${domain}>`)
  form.append('to', to)
  form.append('subject', 'Your Kit Grail order is confirmed')
  form.append('text',
    `Thank you for your order!\n\n${itemList}\n\nTotal: $${total.toFixed(2)}\n\nWe'll let you know when your order ships.`
  )

  const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: 'POST',
    headers: {Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`},
    body: form,
  })
  if (!res.ok) {
    throw new Error(`Mailgun error ${res.status}: ${await res.text()}`)
  }
}
