"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerListingsService = void 0;
const db_1 = require("../db");
const service_1 = require("../kit_listing/service");
class SellerListingsService {
    async create(sellerId, listing) {
        return new service_1.ListingService().createNewKitListing({ seller: sellerId, ...listing });
    }
    async listOwn(sellerId, search) {
        return new service_1.ListingService().getAllKitListings(search, sellerId);
    }
    async update(sellerId, listingId, patch) {
        if (Object.keys(patch).length === 0) {
            return new service_1.ListingService().getKitListingById(listingId);
        }
        const res = await db_1.pool.query(`UPDATE kit_listing
       SET data = data || $1::jsonb
       WHERE id = $2 AND seller = $3
       RETURNING data || jsonb_build_object('id', id, 'seller', seller) AS data`, [JSON.stringify(patch), listingId, sellerId]);
        if (res.rowCount === 0)
            return null;
        return res.rows[0].data;
    }
    async delete(sellerId, listingId) {
        const res = await db_1.pool.query(`DELETE FROM kit_listing WHERE id = $1 AND seller = $2`, [listingId, sellerId]);
        return !!res.rowCount;
    }
}
exports.SellerListingsService = SellerListingsService;
