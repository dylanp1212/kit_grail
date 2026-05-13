import {it, expect} from 'vitest'
import {CheckoutService} from '../src/checkout/service'
import {pool} from '../src/db'
import {fakeSession, SHOPPER_ID} from '../vitest.setup'

it('createOrder inserts order with status paid', async () => {
  const session = fakeSession()
  await new CheckoutService().createOrder(session)
  const res = await pool.query<{status: string}>(
    'SELECT status FROM orders WHERE stripe_session_id = $1',
    [session.id]
  )
  expect(res.rows[0].status).toBe('paid')
})

it('createOrder inserts order items', async () => {
  const session = fakeSession()
  await new CheckoutService().createOrder(session)
  const order = await pool.query<{id: string}>(
    'SELECT id FROM orders WHERE stripe_session_id = $1',
    [session.id]
  )
  const items = await pool.query(
    'SELECT data FROM order_item WHERE order_id = $1',
    [order.rows[0].id]
  )
  expect(items.rows).toHaveLength(2)
  expect(items.rows[0].data.title).toBe('Messi Jersey')
  expect(items.rows[1].data.title).toBe('Italy Jersey')
})

it('createOrder stores shopper id', async () => {
  const session = fakeSession()
  await new CheckoutService().createOrder(session)
  const res = await pool.query<{shopper: string}>(
    'SELECT shopper FROM orders WHERE stripe_session_id = $1',
    [session.id]
  )
  expect(res.rows[0].shopper).toBe(SHOPPER_ID)
})
