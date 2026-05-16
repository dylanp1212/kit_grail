import { Body, Controller, Delete, Get, Patch, Path, Post, Query, Request, Response, Route, Security, SuccessResponse } from 'tsoa'
import * as express from 'express'

import { KitListing } from '../kit_listing'
import { ListingPatch, NewSellerListing } from '.'
import { SellerListingsService } from './service'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

@Route('seller/listings')
export class SellerListingsController extends Controller {
  @Post()
  @Security('apiKey')
  @Response('401', 'Unauthorised')
  public async create(
    @Body() body: NewSellerListing,
    @Request() request: express.Request,
  ): Promise<KitListing | undefined> {
    const sellerId = request.user?.id
    if (!sellerId) {
      this.setStatus(401)
      return undefined
    }
    this.setStatus(201)
    return new SellerListingsService().create(sellerId, body)
  }

  @Get()
  @Security('apiKey')
  @Response('401', 'Unauthorised')
  public async list(
    @Request() request: express.Request,
    @Query() search?: string,
  ): Promise<KitListing[]> {
    const sellerId = request.user?.id
    if (!sellerId) {
      this.setStatus(401)
      return []
    }
    return new SellerListingsService().listOwn(sellerId, search)
  }

  @Patch('{id}')
  @Security('apiKey')
  @Response('400', 'Invalid ID format')
  @Response('401', 'Unauthorised')
  @Response('404', 'Not found')
  public async update(
    @Path() id: string,
    @Body() body: ListingPatch,
    @Request() request: express.Request,
  ): Promise<KitListing | undefined> {
    const sellerId = request.user?.id
    if (!sellerId) {
      this.setStatus(401)
      return undefined
    }
    if (!UUID_RE.test(id)) {
      this.setStatus(400)
      return undefined
    }
    const updated = await new SellerListingsService().update(sellerId, id, body)
    if (!updated) {
      this.setStatus(404)
      return undefined
    }
    return updated
  }

  @Delete('{id}')
  @Security('apiKey')
  @SuccessResponse('204', 'No Content')
  @Response('400', 'Invalid ID format')
  @Response('401', 'Unauthorised')
  @Response('404', 'Not found')
  public async remove(
    @Path() id: string,
    @Request() request: express.Request,
  ): Promise<void> {
    const sellerId = request.user?.id
    if (!sellerId) {
      this.setStatus(401)
      return
    }
    if (!UUID_RE.test(id)) {
      this.setStatus(400)
      return
    }
    const ok = await new SellerListingsService().delete(sellerId, id)
    if (!ok) {
      this.setStatus(404)
      return
    }
    this.setStatus(204)
  }
}
