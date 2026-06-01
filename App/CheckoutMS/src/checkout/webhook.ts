import Stripe from 'stripe'
import {Request, Response} from 'express'
import {CheckoutService} from './service'

export async function webhookHandler(req: Request, res: Response): Promise<void> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  const sig = req.headers['stripe-signature'] as string
  let event: ReturnType<typeof stripe.webhooks.constructEvent>
  try {
    // check webhook signature and parse
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret)
  } catch {
    res.status(400).send('Webhook signature verification failed')
    return
  }

  const service = new CheckoutService()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as {
      id: string,
      metadata?: Record<string, string> | null,
      customer_details?: {email?: string | null} | null,
    }
    try {
      await service.createOrder(session)
    } catch (err) {
      console.error('createOrder failed:', err)
      res.status(500).json({error: 'createOrder failed'})
      return
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as {metadata?: Record<string, string> | null}
    const items = session.metadata?.items
      ? (JSON.parse(session.metadata.items) as {id: string}[])
      : []
    if (items.length > 0) {
      await service.setListingsActive(items.map(i => i.id), true)
    }
  }

  res.json({received: true})
}
