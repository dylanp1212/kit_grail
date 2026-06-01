"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const LISTING_MS = 'http://localhost:3011/api/v0/kit-listing';
const CHECKOUT_MS = 'http://localhost:3014/api/v0';
class OrderService {
    async getOrdersBySeller(sellerID) {
        const listingsRes = await fetch(`${LISTING_MS}?sellerId=${encodeURIComponent(sellerID)}&includeAll=true`);
        if (!listingsRes.ok) {
            throw new Error(`Failed to fetch listings: ${listingsRes.status}`);
        }
        const listings = await listingsRes.json();
        if (listings.length === 0)
            return [];
        const ids = listings.map(l => l.id).join(',');
        const ordersRes = await fetch(`${CHECKOUT_MS}/checkout/orders/by-listing?ids=${encodeURIComponent(ids)}`);
        if (!ordersRes.ok) {
            throw new Error(`Failed to fetch orders: ${ordersRes.status}`);
        }
        return ordersRes.json();
    }
}
exports.OrderService = OrderService;
