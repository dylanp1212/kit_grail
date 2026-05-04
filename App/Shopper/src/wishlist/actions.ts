'use server'

import {WishlistItem} from '.'
import {WishlistService} from './service'

export async function getAllWishlistItems(userid: string, search?: string): Promise<WishlistItem[]> {
  return new WishlistService().getAllWishlistItems(userid, search);
}
