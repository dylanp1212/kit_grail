import {Controller, Route, Get, Request, Response} from 'tsoa'
import * as express from 'express'

import {SellerOrder} from '.'
import {OrderService} from './service'

@Route('my-orders')
export class OrdersController extends Controller {
  @Get()
  @Response('200', 'OK')
  @Response('401', 'Unauthorised')
  public async getOrders(
    @Request() request: express.Request,
  ): Promise<SellerOrder[]> {
    const sellerID = request.user?.id
    if (!sellerID) {
      this.setStatus(401)
      return []
    }
    this.setStatus(200)
    return new OrderService().getOrdersBySeller(sellerID)
  }
}
