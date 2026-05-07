'use server'

import {WishlistItem} from '.'
import {WishlistService} from './service'

export async function getAllWishlistItems(userid: string, search?: string): Promise<WishlistItem[]> {
  return new WishlistService().getAllWishlistItems(userid, search);
}

export async function addToWishlist(listingid:string, userid: string): Promise<WishlistItem|null> {
  return new WishlistService().addToWishlist(listingid, userid);
}

export async function removeFromWishlist(listingid:string, userid: string): Promise<string> {
  return new WishlistService().removeFromWishlist(listingid, userid);
}

export async function checkInWishlist(listingid:string, userid: string): Promise<boolean> {
  return new WishlistService().checkInWishlist(listingid, userid);
}
