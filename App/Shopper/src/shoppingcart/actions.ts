'use server'

import {cookies} from 'next/headers'
import {CartService} from './service'
import {CartItem} from '.'
import {getSessionUser} from '../auth/actions'

async function getOrCreateShopperId(): Promise<string> {
  const user = await getSessionUser()
  // if authenticate use user id
  if (user) return user.id
  const cookie = await cookies()
  // check if guest id exists in cookie
  const guestId = cookie.get('guest_id')?.value
  // return cookie if guest id exists
  if (guestId) return guestId
  // else create new guest id and set cookie
  const newId = await new CartService().createGuestShopper()
  cookie.set('guest_id', newId, {httpOnly: true, path: '/'})
  return newId
}

export async function getShopperId(): Promise<string> {
  return getOrCreateShopperId()
}

export async function getAllCartItems(): Promise<CartItem[]> {
  const shopperid = await getOrCreateShopperId()
  return new CartService().getAllCartItems(shopperid)
}

export async function addToCart(listingid: string): Promise<string> {
  const shopperid = await getOrCreateShopperId()
  return new CartService().addToCart(listingid, shopperid)
}

export async function removeFromCart(listingid: string): Promise<string> {
  const shopperid = await getOrCreateShopperId()
  return new CartService().removeFromCart(listingid, shopperid)
}

export async function checkInCart(listingid: string): Promise<boolean> {
  const shopperid = await getOrCreateShopperId()
  return new CartService().checkInCart(listingid, shopperid)
}

export async function clearCart(): Promise<boolean> {
  const shopperid = await getOrCreateShopperId()
  return new CartService().clearCart(shopperid)
}

export async function mergeGuestCart(): Promise<void> {
  const user = await getSessionUser()
  if (!user) return
  const cookie = await cookies()
  const guestId = cookie.get('guest_id')?.value
  if (!guestId) return
  await new CartService().mergeCarts(guestId, user.id)
  cookie.delete('guest_id')
}
