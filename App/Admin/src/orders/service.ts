import {DetailedSellerOrder, FullOrder} from '.'

const CHECKOUT_MS = 'http://localhost:3014/api/v0'

export class OrderService {
  public async getOrdersBySeller(sellerid: string): Promise<DetailedSellerOrder[]> {
    const res = await fetch(`${CHECKOUT_MS}/checkout/orders/by-seller?sellerid=${encodeURIComponent(sellerid)}`)
    if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`)
    return res.json() as Promise<DetailedSellerOrder[]>
  }

  public async getAllOrders(): Promise<FullOrder[]> {
    const res = await fetch(`${CHECKOUT_MS}/checkout/orders/all`)
    if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`)
    return res.json() as Promise<FullOrder[]>
  }
}
