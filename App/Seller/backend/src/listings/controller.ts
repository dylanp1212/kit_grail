import {
  Body,
  Controller,
  Post,
  Response,
  Route,
  Get,
  Request,
  Patch,
  Path,
} from 'tsoa';
import * as express from 'express';

import { MyListings, NewListing, EditedListing } from '.';
import { ListingService } from './service';

@Route('my-listings')
export class ListingsController extends Controller {
  @Get('all')
  @Response('200', 'OK')
  @Response('401', 'Unauthorised')
  public async getMyListings(
    @Request() request: express.Request,
  ): Promise<MyListings[]> {
    const userID = request.user?.id;
    if (!userID) {
      this.setStatus(401);
      return [];
    }
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
  @Response('401', 'Unauthorised')
  public async createNewListing(
    @Body() newListing: NewListing,
    @Request() request: express.Request,
  ): Promise<MyListings | undefined> {
    const userID = request.user?.id;
    const cookies = request.cookies as Record<string, unknown> | undefined;
    const jwe = typeof cookies?.seller_session === 'string'
      ? cookies.seller_session
      : undefined;
    if (!userID || !jwe) {
      this.setStatus(401);
      return undefined;
    }
    const listing = await new ListingService().createNewListing(
      {...newListing, seller: userID},
      jwe,
    );
    if (!listing) {
      this.setStatus(400);
      return undefined;
    }
    this.setStatus(201);
    return listing;
  }

  @Patch(`{listingID}`)
  @Response('201', 'OK')
  @Response('401', 'Unauthorised')
  public async editListing(
    @Body() listing: EditedListing,
    @Request() request: express.Request,
    @Path() listingID: string
  ): Promise<MyListings | undefined> {
    const userID = request.user?.id;
    const cookies = request.cookies as Record<string, unknown> | undefined;
    const jwe = typeof cookies?.seller_session === 'string'
      ? cookies.seller_session
      : undefined;
    if (!userID || !jwe) {
      this.setStatus(401);
      return undefined;
    }
    this.setStatus(200);

    return await new ListingService().editListing(listing, listingID, jwe);
  }
}

