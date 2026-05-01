'use server'

import { getAllListings as getAll } from '../../kit_listing/service'

export async function getAllListings() {
    // update to include auth when available
  return getAll()
}
