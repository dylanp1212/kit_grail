import {
  Controller, Get, Post, Body, Path, Query, Request, Response, Route, Security,
  Patch,
} from 'tsoa'
import * as express from 'express'

import { KitListing, KitListingPatch, NewKitListing, Options, Size } from '.'
import { ListingService } from './service'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

@Route('kit-listing')
export class ListingController extends Controller {
  @Get()
  public async getAllKitListings(
    @Query() search?: string,
    @Query() sellerId?: string,
    @Query() sizes?: Size[],
    @Query() colors?: string[],
    @Query() includeAll?: boolean,
  ): Promise<KitListing[]> {
    const options: Options = { sizes, colors, includeAll }
    return new ListingService().getAllKitListings(search, sellerId, options)
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
  @Security('jwe')
  @Response('401', 'Unauthorised')
  public async createNewKitListing(
    @Body() newListing: NewKitListing,
    @Request() request: express.Request,
  ): Promise<KitListing|undefined> {
    if (!request.user?.id) {
      this.setStatus(401)
      return undefined
    }
    const withSeller = {...newListing, seller: request.user.id}
    this.setStatus(201)
    return new ListingService().createNewKitListing(withSeller)
  }

  @Patch('{id}')
  @Security('jwe')
  public async editKitListing(
    @Body() listing: KitListingPatch,
    @Request() request: express.Request,
    @Path() id: string,
  ): Promise<KitListing | undefined> {
    if (!request.user?.id) {
      this.setStatus(401)
      return undefined
    }
    this.setStatus(201);
    return await new ListingService().editKitListing(id, request.user.id, listing);
  }
}
