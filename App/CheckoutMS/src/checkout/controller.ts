import {Controller, Post, Body, Route, Response, Get, Query} from 'tsoa'
import {CheckoutSessionRequest, CheckoutSessionResponse, SellerOrder} from '.'
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
      return {url: ''}
    }
    return new CheckoutService().createSession(
      body.shopperid,
      body.items,
      body.successUrl,
      body.cancelUrl
    )
  }

  @Get('orders/by-listing')
  @Response('400', 'Missing ids')
  public async getOrdersByListing(
    @Query() ids: string
  ): Promise<SellerOrder[]> {
    if (!ids) {
      this.setStatus(400)
      return []
    }
    return new CheckoutService().getOrdersByListingIds(ids.split(','))
  }
}
