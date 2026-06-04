import { Body, Controller, Get, Path, Put, Route } from 'tsoa'
import { Seller, SellerService } from './service'

interface SetSuspendedRequest {
  suspended: boolean
}

@Route('sellers')
export class SellerController extends Controller {
  @Get('')
  public async getAllSellers(): Promise<Seller[]> {
    return new SellerService().getAllSellers()
  }

  @Put('{id}/suspended')
  public async setSuspended(
    @Path() id: string,
    @Body() body: SetSuspendedRequest
  ): Promise<void> {
    await new SellerService().setSuspended(id, body.suspended)
  }
}
