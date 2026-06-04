'use server'

import {OrderService} from './service'
import {DetailedSellerOrder, FullOrder} from '.'

export async function getOrdersBySeller(sellerid: string): Promise<DetailedSellerOrder[]> {
  return new OrderService().getOrdersBySeller(sellerid)
}

export async function getAllOrders(): Promise<FullOrder[]> {
  return new OrderService().getAllOrders()
}
