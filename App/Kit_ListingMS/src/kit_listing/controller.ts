import { Controller, Get, Post, Body, Path, Query, Response, Route } from 'tsoa'
import { KitListing, NewKitListing } from '.'
import { ListingService } from './service'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

@Route('kit-listing')
export class ListingController extends Controller {
  @Get()
  public async getAllKitListings(@Query() search?: string, @Query() sellerId?: string): Promise<KitListing[]> {
    return new ListingService().getAllKitListings(search, sellerId)
  }

  @Get('{id}')
  @Response('400', 'Invalid ID format')
  @Response('404', 'Not found')
  public async getKitListingById(@Path() id: string): Promise<KitListing | undefined> {
    if (!UUID_RE.test(id)) {
      this.setStatus(400)
      return undefined
    }
    const listing = await new ListingService().getKitListingById(id)
    if (!listing) {
      this.setStatus(404)
      return undefined
    }
    return listing
  }

  @Post()
  @Response('400', 'Invalid seller ID format')
  public async createNewKitListing(@Body() newListing: NewKitListing): Promise<KitListing|undefined> {
    if (!UUID_RE.test(newListing.seller)) {
      this.setStatus(400)
      return undefined
    }
    this.setStatus(201)
    return new ListingService().createNewKitListing(newListing)
  }
}
