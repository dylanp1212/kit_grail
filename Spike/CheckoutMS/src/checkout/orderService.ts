import Stripe from 'stripe'
import {pool} from '../db'

export class OrderService {
  public async createOrder(session: Stripe.Checkout.Session): Promise<void> {
    const shopperid = session.metadata?.shopperid ?? ''
    const orderId = await this.insertOrder(shopperid, session.id)
    const items = JSON.parse(session.metadata?.items ?? '[]') as {id: string, title: string, price: number}[]
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

  private async insertOrderItem(orderid: string, item: {title: string, price: number}): Promise<void> {
    const q = `
      INSERT INTO order_item(order_id, data)
      VALUES ($1, jsonb_build_object('title', $2::text, 'price', $3::numeric))
    `
    await pool.query({text: q, values: [orderid, item.title, item.price]})
  }
}
