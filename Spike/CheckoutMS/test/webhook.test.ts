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
