'use server'

import {CartService} from './service'
import {CartItem} from '.'
import {getSessionUser} from '../auth/actions'

export async function getAllCartItems(): Promise<CartItem[]> {
  const user = await getSessionUser()
  if (!user) return []
  return new CartService().getAllCartItems(user.id)
}

export async function addToCart(listingid: string): Promise<string> {
  const user = await getSessionUser()
  if (!user) return ''
  return new CartService().addToCart(listingid, user.id)
}

export async function removeFromCart(listingid: string): Promise<string> {
  const user = await getSessionUser()
  if (!user) return ''
  return new CartService().removeFromCart(listingid, user.id)
}

export async function checkInCart(listingid: string): Promise<boolean> {
  const user = await getSessionUser()
  if (!user) return false
  return new CartService().checkInCart(listingid, user.id)
}
