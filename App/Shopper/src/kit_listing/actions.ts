'use server'

import { KitListing } from '.'
import {ListingService} from './service'

export async function getAllKitListings(): Promise<KitListing[]> {
  return new ListingService().getAllKitListings();
}
