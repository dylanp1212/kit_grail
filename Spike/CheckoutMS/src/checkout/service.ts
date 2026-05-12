import Stripe from 'stripe'
import {LineItem, CheckoutSessionResponse} from '.'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')

export class CheckoutService {
  public async createSession(
    items: LineItem[],
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSessionResponse> {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
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
        quantity: 1,
      })),
      success_url: successUrl,
      cancel_url: cancelUrl,
    })
    return {url: session.url ?? ''}
  }
}
