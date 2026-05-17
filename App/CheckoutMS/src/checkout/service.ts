import StripeClient from 'stripe'
import {CheckoutItem, CheckoutSessionResponse} from '.'
import {pool} from '../db'

export class CheckoutService {
  public async createSession(
    shopperid: string,
    items: CheckoutItem[],
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSessionResponse> {
    const stripe = new StripeClient(process.env.STRIPE_SECRET_KEY!)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.title,
            ...(item.image ? {images: [item.image]} : {}),
          },
        },
        // change this to allow different quantities in future
        quantity: 1,
      })),
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {shopperid, items: JSON.stringify(items)},
    })
    if (!session.url){
      throw new Error('URL not found')
    }
    return {url: session.url}
  }

  public async createOrder(session: {id: string, metadata?: Record<string, string> | null}): Promise<void> {
    if (!session.metadata?.shopperid || !session.metadata?.items) {
      throw new Error('Missing metadata on Stripe session')
    }
    const shopperid = session.metadata.shopperid
    const orderId = await this.insertOrder(shopperid, session.id)
    const items = JSON.parse(session.metadata.items) as {title: string, price: number}[]
    for (const item of items) {
      await this.insertOrderItem(orderId, item)
    }
  }

  private async insertOrder(shopperid: string, stripeSessionId: string): Promise<string> {
    const q = `
      INSERT INTO orders(shopper, stripe_session_id, status, data)
      VALUES ($1, $2, 'paid', jsonb_build_object('paid_at', now()))
      RETURNING id
    `
    const res = await pool.query<{id: string}>({text: q, values: [shopperid, stripeSessionId]})
    return res.rows[0].id
  }

  private async insertOrderItem(orderid: string, item: {title: string, price: number}): Promise<string> {
    const q = `
      INSERT INTO order_item(order_id, data)
      VALUES ($1, jsonb_build_object('title', $2::text, 'price', $3::numeric))
      RETURNING id
    `
    const res = await pool.query<{id: string}>({text: q, values: [orderid, item.title, item.price]})
    return res.rows[0].id
  }
}
