import {Controller, Post, Body, Route, Response, Get, Query} from 'tsoa'
import {CheckoutSessionRequest, CheckoutSessionResponse, DetailedSellerOrder, FullOrder, OrdersPerDay, SellerOrder, ShopperOrder} from '.'
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

  @Post('restore')
  @Response('400', 'Missing ids')
  public async restore(@Body() body: {ids: string[]}): Promise<{restored: boolean}> {
    if (!body.ids || body.ids.length === 0) {
      this.setStatus(400)
      return {restored: false}
    }
    await new CheckoutService().incrementQuantities(body.ids)
    return {restored: true}
  }

  @Get('orders/by-shopper')
  @Response('400', 'Missing shopperid')
  public async getOrdersByShopper(
    @Query() shopperid: string
  ): Promise<ShopperOrder[]> {
    if (!shopperid) {
      this.setStatus(400)
      return []
    }
    return new CheckoutService().getOrdersByShopper(shopperid)
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

  @Get('orders/by-seller')
  @Response('400', 'Missing sellerid')
  public async getOrdersBySeller(
    @Query() sellerid: string
  ): Promise<DetailedSellerOrder[]> {
    if (!sellerid) {
      this.setStatus(400)
      return []
    }
    return new CheckoutService().getOrdersBySeller(sellerid)
  }

  @Get('orders/all')
  public async getAllOrders(): Promise<FullOrder[]> {
    return new CheckoutService().getAllOrders()
  }

  @Get('orders/per-day')
  public async getOrdersPerDay(): Promise<OrdersPerDay[]> {
    return new CheckoutService().getOrdersPerDay()
  }
}
