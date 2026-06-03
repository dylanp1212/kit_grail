import {it, expect} from 'vitest'
import request from 'supertest'
import express from 'express'
import Stripe from 'stripe'
import {webhookHandler} from '../src/checkout/webhook'
import {fakeSession} from '../vitest.setup'

const app = express()
app.post('/api/v0/checkout/webhook', express.raw({type: 'application/json'}), webhookHandler)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

it('returns 400 on invalid signature', async () => {
  const res = await request(app)
    .post('/api/v0/checkout/webhook')
    .set('stripe-signature', 'bad')
    .set('Content-Type', 'application/json')
    .send('{}')
  expect(res.status).toBe(400)
})

it('returns 200 and processes checkout.session.completed', async () => {
  const session = fakeSession()
  const payload = JSON.stringify({
    type: 'checkout.session.completed',
    data: {object: session},
  })
  const sig = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: process.env.STRIPE_WEBHOOK_SECRET!,
  })
  const res = await request(app)
    .post('/api/v0/checkout/webhook')
    .set('stripe-signature', sig)
    .set('Content-Type', 'application/json')
    .send(payload)
  expect(res.status).toBe(200)
  expect(res.body).toEqual({received: true})
})

it('restores quantities on checkout.session.expired', async () => {
  const session = {
    id: 'cs_test_expired',
    metadata: {
      items: JSON.stringify([{id: '5e25b4f0-2ef4-4ec0-8ae0-e97ca701eb74'}]),
    },
  }
  const payload = JSON.stringify({
    type: 'checkout.session.expired',
    data: {object: session},
  })
  const sig = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: process.env.STRIPE_WEBHOOK_SECRET!,
  })
  const res = await request(app)
    .post('/api/v0/checkout/webhook')
    .set('stripe-signature', sig)
    .set('Content-Type', 'application/json')
    .send(payload)
  expect(res.status).toBe(200)
})

it('handles checkout.session.expired with no items in metadata', async () => {
  const session = {id: 'cs_test_expired_empty', metadata: {}}
  const payload = JSON.stringify({
    type: 'checkout.session.expired',
    data: {object: session},
  })
  const sig = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: process.env.STRIPE_WEBHOOK_SECRET!,
  })
  const res = await request(app)
    .post('/api/v0/checkout/webhook')
    .set('stripe-signature', sig)
    .set('Content-Type', 'application/json')
    .send(payload)
  expect(res.status).toBe(200)
})

it('returns 500 when createOrder fails', async () => {
  const session = fakeSession({metadata: {}})
  const payload = JSON.stringify({
    type: 'checkout.session.completed',
    data: {object: session},
  })
  const sig = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: process.env.STRIPE_WEBHOOK_SECRET!,
  })
  const res = await request(app)
    .post('/api/v0/checkout/webhook')
    .set('stripe-signature', sig)
    .set('Content-Type', 'application/json')
    .send(payload)
  expect(res.status).toBe(500)
  expect(res.body.error).toBe('createOrder failed')
})
