import { Controller, Delete, Get, Path, Post, Query, Response, Route, SuccessResponse } from 'tsoa'
import { WishlistItem } from '.'
import { WishlistService } from './service'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

@Route('wishlist')
export class WishlistController extends Controller {
  @Get('{userid}')
  @Response('400', 'Invalid user ID format')
  public async getAllWishlistItems(
    @Path() userid: string,
    @Query() search?: string
  ): Promise<WishlistItem[] | undefined> {
    if (!UUID_RE.test(userid)) {
      this.setStatus(400)
      return undefined
    }
    return new WishlistService().getAllWishlistItems(userid, search)
  }

  @Get('{userid}/{listingid}')
  @Response('400', 'Invalid ID format')
  public async checkInWishlist(
    @Path() userid: string,
    @Path() listingid: string
  ): Promise<boolean | undefined> {
    if (!UUID_RE.test(userid) || !UUID_RE.test(listingid)) {
      this.setStatus(400)
      return undefined
    }
    return new WishlistService().checkInWishlist(listingid, userid)
  }

  @Post('{userid}/{listingid}')
  @SuccessResponse('201', 'Added to wishlist')
  @Response('400', 'Invalid ID format')
  @Response('409', 'Already in wishlist')
  public async addToWishlist(
    @Path() userid: string,
    @Path() listingid: string
  ): Promise<WishlistItem | undefined> {
    if (!UUID_RE.test(userid) || !UUID_RE.test(listingid)) {
      this.setStatus(400)
      return undefined
    }
    const item = await new WishlistService().addToWishlist(listingid, userid)
    if (!item) {
      this.setStatus(409)
      return undefined
    }
    this.setStatus(201)
    return item
  }

  @Delete('{userid}/{listingid}')
  @Response('400', 'Invalid ID format')
  public async removeFromWishlist(
    @Path() userid: string,
    @Path() listingid: string
  ): Promise<string | undefined> {
    if (!UUID_RE.test(userid) || !UUID_RE.test(listingid)) {
      this.setStatus(400)
      return undefined
    }
    return new WishlistService().removeFromWishlist(listingid, userid)
  }
}
