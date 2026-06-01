'use server'

import { revalidatePath } from 'next/cache'
import { SellerService } from './service'
import { Seller } from '.'

export async function getAllSellers(): Promise<Seller[]> {
  return new SellerService().getAllSellers()
}

export async function setSuspended(id: string, suspended: boolean): Promise<void> {
  await new SellerService().setSuspended(id, suspended)
  revalidatePath('/sellers')
}
