import {
  Body,
  Controller,
  Post,
  Response,
  Route,
  Get,
  Query,
} from 'tsoa';
import { MyListings, NewListing } from '.';
import { ListingService } from './service';

@Route('my-listings')
export class ListingsController extends Controller {
  @Get('all')
  @Response('200', 'OK')
  public async getMyListings(
    @Query() userID: string,
  ): Promise<MyListings[]> {
    this.setStatus(200);
    return new ListingService().getMyListings(userID);
  }

  @Get('{listingID}')
  @Response('200', 'OK')
  @Response('404', 'Not Found')
  public async getListing(listingID: string): Promise<MyListings | undefined> {
    const listing = await new ListingService().getListing(listingID);
    if (!listing) {
      this.setStatus(404);
      return undefined;
    }
    this.setStatus(200);
    return listing;
  }
  @Post()
  @Response('201', 'OK')
  @Response('400', 'Bad seller ID')
  public async createNewListing(@Body() newListing: NewListing): Promise<MyListings | undefined> {
    const listing = await new ListingService().createNewListing(newListing);
    if (!listing) {
      this.setStatus(400);
      return undefined;
    }
    this.setStatus(201);
    return listing;
  }
}

