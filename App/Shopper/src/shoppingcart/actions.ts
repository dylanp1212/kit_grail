'use server'
import {CartService} from './service'
import { CartItem } from '.'

export async function getAllCartItems(userid: string): Promise<CartItem[]> {
  return new CartService().getAllCartItems(userid);
}

export async function addToCart(listingid:string, userid: string): Promise<string> {
  return new CartService().addToCart(listingid, userid);
}

export async function removeFromCart(listingid:string, userid: string): Promise<string> {
  return new CartService().removeFromCart(listingid, userid);
}

export async function checkInCart(listingid:string, userid: string): Promise<boolean> {
  return new CartService().checkInCart(listingid, userid);
}
