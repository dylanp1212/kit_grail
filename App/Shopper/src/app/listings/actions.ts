'use server'

import { getListings } from '../../kit_listing/service'

export async function getAllListings() {
    // update to include auth when available
  return getListings()
}
