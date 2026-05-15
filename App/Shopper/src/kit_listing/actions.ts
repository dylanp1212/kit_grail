'use server'

import { KitListing } from '.'
import {ListingService} from './service'

export async function getAllKitListings(search?: string, sellerId?: string): Promise<KitListing[]> {
  return new ListingService().getAllKitListings(search, sellerId);
}

export async function getKitListingById(id: string): Promise<KitListing|null> {
  return new ListingService().getKitListingById(id);
}
