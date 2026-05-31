'use server'

import { KitListing, Options } from '.'
import {ListingService} from './service'

export async function getAllKitListings(search?: string, sellerId?: string, options?: Options): Promise<KitListing[]> {
  return new ListingService().getAllKitListings(search, sellerId, options);
}

export async function getKitListingById(id: string): Promise<KitListing|null> {
  return new ListingService().getKitListingById(id);
}
