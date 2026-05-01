'use server'

import { getListings } from '../../kit_listing/service'

export async function getAllListings() {
  return getListings()
}
