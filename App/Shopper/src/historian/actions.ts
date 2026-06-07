'use server'

import {ListingHistory} from '.'
import {HistorianService} from './service'

export async function getListingHistory(id: string): Promise<ListingHistory | null> {
  return new HistorianService().getListingHistory(id)
}
