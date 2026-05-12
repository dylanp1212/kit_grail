'use server'

import {WishlistItem} from '.'
import {WishlistService} from './service'
import {getSessionUser} from '../auth/actions'

export async function getAllWishlistItems(search?: string): Promise<WishlistItem[]> {
  const user = await getSessionUser()
  if (!user) return []
  return new WishlistService().getAllWishlistItems(user.id, search)
}

export async function addToWishlist(listingid: string): Promise<WishlistItem | null> {
  const user = await getSessionUser()
  if (!user) return null
  return new WishlistService().addToWishlist(listingid, user.id)
}

export async function removeFromWishlist(listingid: string): Promise<string> {
  const user = await getSessionUser()
  if (!user) return ''
  return new WishlistService().removeFromWishlist(listingid, user.id)
}

export async function checkInWishlist(listingid: string): Promise<boolean> {
  const user = await getSessionUser()
  if (!user) return false
  return new WishlistService().checkInWishlist(listingid, user.id)
}
