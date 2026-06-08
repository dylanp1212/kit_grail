import {it, expect, vi} from 'vitest'
import {CheckoutService} from '../src/checkout/service'
import {pool} from '../src/db'
import {fakeSession, SHOPPER_ID} from '../vitest.setup'

it('createOrder inserts order with status, shopper, and items', async () => {
  const session = fakeSession()
  await new CheckoutService().createOrder(session)
  const order = await pool.query<{id: string, status: string, shopper: string}>(
    `SELECT id, shopper, data->>'status' AS status FROM orders WHERE data->>'stripe_session_id' = $1`,
    [session.id]
  )
  expect(order.rows[0].status).toBe('paid')
  expect(order.rows[0].shopper).toBe(SHOPPER_ID)

  const items = await pool.query(
    'SELECT data FROM order_item WHERE order_id = $1',
    [order.rows[0].id]
  )
  expect(items.rows).toHaveLength(2)
  expect(items.rows[0].data.title).toBe('Messi Jersey')
  expect(items.rows[1].data.title).toBe('Italy Jersey')
})

it('createOrder sends confirmation email when customer email is present', async () => {
  const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response('ok', {status: 200})
  )
  const session = {
    ...fakeSession(),
    customer_details: {email: 'buyer@kg.test'},
  }
  await new CheckoutService().createOrder(session)
  expect(fetchSpy).toHaveBeenCalledOnce()
  expect(fetchSpy.mock.calls[0][0]).toContain('api.mailgun.net')
  fetchSpy.mockRestore()
})
