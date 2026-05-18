import StripeClient from 'stripe'
import {CheckoutItem, CheckoutSessionResponse, SellerOrder} from '.'
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
      metadata: {shopperid, items: JSON.stringify(items.map(i => ({id: i.id, title: i.title, price: i.price})))},
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
    const items = JSON.parse(session.metadata.items) as {id: string, title: string, price: number}[]
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

  private async insertOrderItem(orderid: string, item: {id: string, title: string, price: number}): Promise<string> {
    const q = `
      INSERT INTO order_item(order_id, kit_listing, data)
      VALUES ($1, $2, jsonb_build_object('title', $3::text, 'price', $4::numeric))
      RETURNING id
    `
    const res = await pool.query<{id: string}>({text: q, values: [orderid, item.id, item.title, item.price]})
    return res.rows[0].id
  }

  public async getOrdersByListingIds(listingIds: string[]): Promise<SellerOrder[]> {
    const q = `
      SELECT
        o.id, o.shopper, o.status,
        o.data->>'paid_at' AS paid_at,
        json_agg(json_build_object(
          'id', oi.id,
          'kit_listing', oi.kit_listing,
          'title', oi.data->>'title',
          'price', (oi.data->>'price')::numeric
        )) AS items
      FROM orders o
      JOIN order_item oi ON oi.order_id = o.id
      WHERE oi.kit_listing = ANY($1::uuid[])
      GROUP BY o.id
    `
    const res = await pool.query<SellerOrder>({text: q, values: [listingIds]})
    return res.rows
  }
}
