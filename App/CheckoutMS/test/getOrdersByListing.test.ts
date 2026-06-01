import {beforeEach, describe, expect, it} from 'vitest'

import {CheckoutService} from '../src/checkout/service'
import {pool} from '../src/db'

const LISTING_A = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
const LISTING_B = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
const LISTING_OTHER_SELLER = 'cccccccc-cccc-cccc-cccc-cccccccccccc'

const SALLY = 'e1111111-1111-1111-1111-111111111111'
const TOMMY = 'e2222222-2222-2222-2222-222222222222'
const NAMELESS_SHOPPER = 'e3333333-3333-3333-3333-333333333333'

async function insertShopper(id: string, name: string | null, email: string | null) {
  const data: Record<string, string> = {}
  if (name) data.name = name
  if (email) data.email = email
  await pool.query(`INSERT INTO shopper(id, data) VALUES ($1, $2::jsonb)`, [
    id,
    JSON.stringify(data),
  ])
}

async function insertOrder(
  orderId: string,
  shopper: string,
  paidAt: string,
  items: Array<{listing: string; title: string; price: number}>,
) {
  await pool.query(
    `INSERT INTO orders(id, shopper, stripe_session_id, status, data)
     VALUES ($1, $2, $3, 'paid', jsonb_build_object('paid_at', $4::timestamptz))`,
    [orderId, shopper, `cs_${orderId}`, paidAt],
  )
  for (const it of items) {
    await pool.query(
      `INSERT INTO order_item(order_id, kit_listing, data)
       VALUES ($1, $2, jsonb_build_object('title', $3::text, 'price', $4::numeric))`,
      [orderId, it.listing, it.title, it.price],
    )
  }
}

beforeEach(async () => {
  await pool.query('DELETE FROM order_item')
  await pool.query('DELETE FROM orders')
  await pool.query('DELETE FROM shopper')
})

describe('CheckoutService.getOrdersByListingIds', () => {
  it('returns shopper name and email from the shopper table', async () => {
    await insertShopper(SALLY, 'Sally Shopper', 'sally@kg.test')
    await insertOrder(
      '10000000-0000-0000-0000-000000000001',
      SALLY,
      '2026-05-01T10:00:00Z',
      [{listing: LISTING_A, title: 'Argentina Jersey', price: 300}],
    )

    const orders = await new CheckoutService().getOrdersByListingIds([LISTING_A])

    expect(orders).toHaveLength(1)
    expect(orders[0].shopper_name).toBe('Sally Shopper')
    expect(orders[0].shopper_email).toBe('sally@kg.test')
  })

  it('returns undefined-ish shopper fields when the shopper row has none', async () => {
    await insertShopper(NAMELESS_SHOPPER, null, null)
    await insertOrder(
      '10000000-0000-0000-0000-000000000002',
      NAMELESS_SHOPPER,
      '2026-05-02T10:00:00Z',
      [{listing: LISTING_A, title: 'Anonymous Order', price: 50}],
    )

    const [order] = await new CheckoutService().getOrdersByListingIds([LISTING_A])

    expect(order.shopper_name).toBeFalsy()
    expect(order.shopper_email).toBeFalsy()
  })

  it('returns orders sorted by paid_at DESC (newest first)', async () => {
    await insertShopper(SALLY, 'Sally', 's@x')
    await insertShopper(TOMMY, 'Tommy', 't@x')
    await insertOrder(
      '10000000-0000-0000-0000-000000000003',
      SALLY,
      '2026-04-01T10:00:00Z',
      [{listing: LISTING_A, title: 'Old', price: 10}],
    )
    await insertOrder(
      '10000000-0000-0000-0000-000000000004',
      TOMMY,
      '2026-05-01T10:00:00Z',
      [{listing: LISTING_A, title: 'New', price: 20}],
    )

    const orders = await new CheckoutService().getOrdersByListingIds([LISTING_A])

    expect(orders.map((o) => o.shopper_name)).toEqual(['Tommy', 'Sally'])
  })

  it('returns only items matching the seller\'s listing ids', async () => {
    // Sally buys two jerseys from different sellers in one order.
    // Calling with only listing A's id must NOT leak listing C's item.
    await insertShopper(SALLY, 'Sally', 's@x')
    await insertOrder(
      '10000000-0000-0000-0000-000000000005',
      SALLY,
      '2026-05-01T10:00:00Z',
      [
        {listing: LISTING_A, title: 'My Jersey', price: 100},
        {listing: LISTING_OTHER_SELLER, title: 'Other Seller Jersey', price: 200},
      ],
    )

    const [order] = await new CheckoutService().getOrdersByListingIds([LISTING_A])

    expect(order.items).toHaveLength(1)
    expect(order.items[0].title).toBe('My Jersey')
  })

  it('returns empty array when no orders match', async () => {
    const orders = await new CheckoutService().getOrdersByListingIds([LISTING_A])
    expect(orders).toEqual([])
  })

  it('handles multiple listing ids across multiple orders', async () => {
    await insertShopper(SALLY, 'Sally', 's@x')
    await insertOrder(
      '10000000-0000-0000-0000-000000000006',
      SALLY,
      '2026-05-01T10:00:00Z',
      [{listing: LISTING_A, title: 'A', price: 10}],
    )
    await insertOrder(
      '10000000-0000-0000-0000-000000000007',
      SALLY,
      '2026-05-02T10:00:00Z',
      [{listing: LISTING_B, title: 'B', price: 20}],
    )

    const orders = await new CheckoutService().getOrdersByListingIds([
      LISTING_A,
      LISTING_B,
    ])

    expect(orders).toHaveLength(2)
  })
})
