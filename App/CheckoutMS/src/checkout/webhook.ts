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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as {
      id: string,
      metadata?: Record<string, string> | null,
      customer_details?: {email?: string | null} | null,
    }
    try {
      await new CheckoutService().createOrder(session)
    } catch (err) {
      // redirect to error page in future
      console.error('createOrder failed:', err)
      res.status(500).json({error: 'createOrder failed'})
      return
    }
  }
  res.json({received: true})
}
