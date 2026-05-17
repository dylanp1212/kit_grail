import {Controller, Post, Body, Route, Response} from 'tsoa'
import {CheckoutSessionRequest, CheckoutSessionResponse} from '.'
import {CheckoutService} from './service'

@Route('checkout')
export class CheckoutController extends Controller {
  @Post('session')
  @Response('400', 'Bad request')
  public async createSession(
    @Body() body: CheckoutSessionRequest
  ): Promise<CheckoutSessionResponse> {
    if (!body.items || body.items.length === 0) {
      this.setStatus(400)
      // change this to return error message in future
      return {url: ''}
    }
    return new CheckoutService().createSession(
      body.shopperid,
      body.items,
      body.successUrl,
      body.cancelUrl
    )
  }
}
