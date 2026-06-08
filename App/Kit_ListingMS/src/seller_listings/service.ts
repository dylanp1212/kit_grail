import { pool } from '../db'
import { ListingService } from '../kit_listing/service'
import { KitListing } from '../kit_listing'
import { ListingPatch, NewSellerListing } from '.'

interface rowreturn {
  data: KitListing
}

export class SellerListingsService {
  public async create(sellerId: string, listing: NewSellerListing): Promise<KitListing> {
    return new ListingService().createNewKitListing({ seller: sellerId, ...listing })
  }

  public async listOwn(sellerId: string, search?: string): Promise<KitListing[]> {
    return new ListingService().getAllKitListings(search, sellerId)
  }

  public async update(
    sellerId: string,
    listingId: string,
    patch: ListingPatch,
  ): Promise<KitListing | null> {
    if (Object.keys(patch).length === 0) {
      return new ListingService().getKitListingById(listingId)
    }
    const res = await pool.query<rowreturn>(
      `UPDATE kit_listing
       SET data = data || $1::jsonb
       WHERE id = $2 AND seller = $3
       RETURNING data || jsonb_build_object('id', id, 'seller', seller) AS data`,
      [JSON.stringify(patch), listingId, sellerId],
    )
    if (res.rowCount === 0) return null
    return res.rows[0].data
  }

  public async delete(sellerId: string, listingId: string): Promise<boolean> {
    const res = await pool.query(
      `DELETE FROM kit_listing WHERE id = $1 AND seller = $2`,
      [listingId, sellerId],
    )
    return !!res.rowCount
  }
}
