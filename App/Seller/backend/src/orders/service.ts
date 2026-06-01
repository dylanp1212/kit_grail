import {SellerOrder} from '.'

const LISTING_MS = 'http://localhost:3011/api/v0/kit-listing'
const CHECKOUT_MS = 'http://localhost:3014/api/v0'

export class OrderService {
  public async getOrdersBySeller(sellerID: string): Promise<SellerOrder[]> {
    // fetch listing for a seller from listingMS
    const listingsRes = await fetch(`${LISTING_MS}?sellerId=${encodeURIComponent(sellerID)}&includeAll=true`)
    if (!listingsRes.ok){
    throw new Error(`Failed to fetch listings: ${listingsRes.status}`)
    }

    const listings = await listingsRes.json() as {id: string}[]

    // if no listings matching seller return empty array
    if (listings.length === 0) return []

    const ids = listings.map(l => l.id).join(',')
    
    // fetch orders from listing ids from checkoutMS
    const ordersRes = await fetch(`${CHECKOUT_MS}/checkout/orders/by-listing?ids=${encodeURIComponent(ids)}`)
    if (!ordersRes.ok){
        throw new Error(`Failed to fetch orders: ${ordersRes.status}`)
    }
    return ordersRes.json() as Promise<SellerOrder[]>
  }
}
