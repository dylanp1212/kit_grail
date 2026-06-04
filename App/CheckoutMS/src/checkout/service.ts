import StripeClient from 'stripe'
import {CheckoutItem, CheckoutSessionResponse, DetailedSellerOrder, FullOrder, OrdersPerDay, SellerOrder, ShopperOrder} from '.'
import {pool} from '../db'
import {sendOrderConfirmation} from './email'

export class CheckoutService {
  public async assertQuantityAvailable(ids: string[]): Promise<void> {
    const res = await pool.query<{id: string}>(
      `SELECT id FROM kit_listing WHERE id = ANY($1::uuid[]) AND (data->>'quantity')::int <= 0`,
      [ids]
    )
    if (res.rows.length > 0) {
      throw new Error('One or more listings are no longer available')
    }
  }

  public async decrementQuantities(ids: string[]): Promise<void> {
    await pool.query(
      `UPDATE kit_listing
       SET data = jsonb_set(data, '{quantity}', ((data->>'quantity')::int - 1)::text::jsonb)
       WHERE id = ANY($1::uuid[]) AND data ? 'quantity' AND (data->>'quantity')::int > 0`,
      [ids]
    )
  }

  public async incrementQuantities(ids: string[]): Promise<void> {
    await pool.query(
      `UPDATE kit_listing
       SET data = jsonb_set(data, '{quantity}', ((data->>'quantity')::int + 1)::text::jsonb)
       WHERE id = ANY($1::uuid[]) AND data ? 'quantity'`,
      [ids]
    )
  }

  public async createSession(
    shopperid: string,
    items: CheckoutItem[],
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSessionResponse> {
    const ids = items.map(i => i.id)
    await this.assertQuantityAvailable(ids)

    const stripe = new StripeClient(process.env.STRIPE_SECRET_KEY!)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.title,
            ...(item.image?.startsWith('https://') ? {images: [item.image]} : {}),
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

    await this.decrementQuantities(ids)
    return {url: session.url}
  }

  public async createOrder(session: {
    id: string,
    metadata?: Record<string, string> | null,
    customer_details?: {email?: string | null} | null,
  }): Promise<void> {
    if (!session.metadata?.shopperid || !session.metadata?.items) {
      throw new Error('Missing metadata on Stripe session')
    }
    const shopperid = session.metadata.shopperid
    const orderId = await this.insertOrder(shopperid, session.id)
    const items = JSON.parse(session.metadata.items) as {id: string, title: string, price: number}[]
    for (const item of items) {
      await this.insertOrderItem(orderId, item)
    }
    const email = session.customer_details?.email
    if (email) {
      await sendOrderConfirmation(email, items)
    }
  }

  public async insertOrder(shopperid: string, stripeSessionId: string): Promise<string> {
    const q = `
      INSERT INTO orders(shopper, stripe_session_id, status, data)
      VALUES ($1, $2, 'paid', jsonb_build_object('paid_at', now()))
      RETURNING id
    `
    const res = await pool.query<{id: string}>({text: q, values: [shopperid, stripeSessionId]})
    return res.rows[0].id
  }

  public async insertOrderItem(orderid: string, item: {id: string, title: string, price: number}): Promise<string> {
    const q = `
      INSERT INTO order_item(order_id, kit_listing, data)
      VALUES ($1, $2, jsonb_build_object('title', $3::text, 'price', $4::numeric))
      RETURNING id
    `
    const res = await pool.query<{id: string}>({text: q, values: [orderid, item.id, item.title, item.price]})
    return res.rows[0].id
  }

  public async getOrdersByShopper(shopperid: string): Promise<ShopperOrder[]> {
    const q = `
      SELECT
        o.id, o.status,
        o.data->>'paid_at' AS paid_at,
        json_agg(json_build_object(
          'id', oi.id,
          'kit_listing', oi.kit_listing,
          'title', oi.data->>'title',
          'price', (oi.data->>'price')::numeric
        )) AS items
      FROM orders o
      JOIN order_item oi ON oi.order_id = o.id
      WHERE o.shopper = $1
      GROUP BY o.id
      ORDER BY o.data->>'paid_at' DESC NULLS LAST
    `
    const res = await pool.query<ShopperOrder>({text: q, values: [shopperid]})
    return res.rows
  }

  public async getOrdersByListingIds(listingIds: string[]): Promise<SellerOrder[]> {
    const q = `
      SELECT
        o.id, o.shopper, o.status,
        o.data->>'paid_at' AS paid_at,
        s.data->>'name'  AS shopper_name,
        s.data->>'email' AS shopper_email,
        json_agg(json_build_object(
          'id', oi.id,
          'kit_listing', oi.kit_listing,
          'title', oi.data->>'title',
          'price', (oi.data->>'price')::numeric
        )) AS items
      FROM orders o
      JOIN order_item oi ON oi.order_id = o.id
      LEFT JOIN shopper s ON s.id = o.shopper
      WHERE oi.kit_listing = ANY($1::uuid[])
      GROUP BY o.id, s.data
      ORDER BY o.data->>'paid_at' DESC NULLS LAST
    `
    const res = await pool.query<SellerOrder>({text: q, values: [listingIds]})
    return res.rows
  }

  public async getOrdersBySeller(sellerid: string): Promise<DetailedSellerOrder[]> {
    const q = `
      SELECT
        o.id, o.shopper, o.status,
        o.data->>'paid_at' AS paid_at,
        sh.data->>'name'  AS shopper_name,
        sh.data->>'email' AS shopper_email,
        se.data->>'name'  AS seller_name,
        se.data->>'email' AS seller_email,
        json_agg(json_build_object(
          'id', oi.id,
          'kit_listing', oi.kit_listing,
          'title', oi.data->>'title',
          'price', (oi.data->>'price')::numeric
        )) AS items
      FROM orders o
      JOIN order_item oi ON oi.order_id = o.id
      JOIN kit_listing kl ON kl.id = oi.kit_listing
      JOIN seller se ON se.id = kl.seller
      LEFT JOIN shopper sh ON sh.id = o.shopper
      WHERE kl.seller = $1
      GROUP BY o.id, sh.data, se.data
      ORDER BY o.data->>'paid_at' DESC NULLS LAST
    `
    const res = await pool.query<DetailedSellerOrder>({text: q, values: [sellerid]})
    return res.rows
  }

  public async getAllOrders(): Promise<FullOrder[]> {
    const q = `
      SELECT
        o.id,
        o.status,
        o.data->>'paid_at' AS paid_at,
        SUM((oi.data->>'price')::numeric) AS total,
        sh.id AS shopper_id,
        sh.data->>'name'  AS shopper_name,
        sh.data->>'email' AS shopper_email,
        json_agg(json_build_object(
          'id', oi.id,
          'kit_listing', oi.kit_listing,
          'title', oi.data->>'title',
          'price', (oi.data->>'price')::numeric,
          'seller_id', se.id,
          'seller_name', se.data->>'name',
          'seller_email', se.data->>'email'
        )) AS items
      FROM orders o
      JOIN order_item oi ON oi.order_id = o.id
      LEFT JOIN kit_listing kl ON kl.id = oi.kit_listing
      LEFT JOIN seller se ON se.id = kl.seller
      LEFT JOIN shopper sh ON sh.id = o.shopper
      GROUP BY o.id, sh.id, sh.data
      ORDER BY o.data->>'paid_at' DESC NULLS LAST
    `
    const res = await pool.query<FullOrder>({text: q, values: []})
    return res.rows
  }

  public async getOrdersPerDay(): Promise<OrdersPerDay[]> {
    const q = `
      SELECT
        DATE_TRUNC('day', (o.data->>'paid_at')::timestamptz) AS day,
        COUNT(DISTINCT o.id)::int AS count,
        SUM((oi.data->>'price')::numeric) AS total
      FROM orders o
      JOIN order_item oi ON oi.order_id = o.id
      WHERE o.data->>'paid_at' IS NOT NULL
      GROUP BY 1
      ORDER BY 1 DESC
    `
    const res = await pool.query<OrdersPerDay>({text: q, values: []})
    return res.rows
  }
}
