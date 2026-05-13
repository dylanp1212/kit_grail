import Stripe from 'stripe'
import {Request, Response} from 'express'
import {OrderService} from './orderService'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? ''

export async function webhookHandler(req: Request, res: Response): Promise<void> {
  const sig = req.headers['stripe-signature'] as string
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret)
  } catch {
    res.status(400).send('Webhook signature verification failed')
    return
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    try {
      await new OrderService().createOrder(session)
    } catch (err) {
      console.error('createOrder failed:', err)
      res.status(500).json({error: 'createOrder failed'})
      return
    }
  }
  res.json({received: true})
}
