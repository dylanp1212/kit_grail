import {Controller, Route, Get, Query, Response} from 'tsoa'
import {SellerOrder} from '.'
import {OrderService} from './service'

@Route('my-orders')
export class OrdersController extends Controller {
  @Get()
  @Response('200', 'OK')
  public async getOrders(
    @Query() sellerID: string
  ): Promise<SellerOrder[]> {
    this.setStatus(200)
    return new OrderService().getOrdersBySeller(sellerID)
  }
}
