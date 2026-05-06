'use server'
import {CartService} from './service'
import { CartItem } from '.'

export async function getAllCartItems(userid: string): Promise<CartItem[]> {
  return new CartService().getAllCartItems(userid);
}

export async function addToCart(listingid:string, userid: string): Promise<void> {
  return new CartService().addToCart(listingid, userid);
}

export async function removeFromCart(listingid:string, userid: string): Promise<void> {
  return new CartService().removeFromCart(listingid, userid);
}