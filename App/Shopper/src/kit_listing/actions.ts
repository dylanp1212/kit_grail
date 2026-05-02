'use server'

import { KitListing } from '.'
import {ListingService} from './service'

export async function getAllKitListings(search?: string): Promise<KitListing[]> {
  return new ListingService().getAllKitListings(search);
}
