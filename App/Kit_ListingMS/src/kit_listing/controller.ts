import { Controller, Get, Path, Query, Response, Route } from 'tsoa'
import { KitListing, UUID } from '.'
import { ListingService } from './service'

@Route('kit-listing')
export class ListingController extends Controller {
  @Get()
  public async getAllKitListings(@Query() search?: string): Promise<KitListing[]> {
    return new ListingService().getAllKitListings(search)
  }

  @Get('{id}')
  @Response('404', 'Not found')
  public async getKitListingById(@Path() id: UUID): Promise<KitListing | undefined> {
    const listing = await new ListingService().getKitListingById(id)
    if (!listing) {
      this.setStatus(404)
      return undefined
    }
    return listing
  }
}
