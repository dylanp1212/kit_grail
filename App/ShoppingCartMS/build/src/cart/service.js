"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const db_1 = require("../db");
class CartService {
    async getAllCartItems(userid) {
        const q = `
      SELECT kl.data || jsonb_build_object('id', kl.id, 'seller', kl.seller) AS data
      FROM kit_listing kl JOIN shoppingcart w ON kl.id = w.kit_listing
      WHERE w.shopper = $1
    `;
        const query = { text: q, values: [userid] };
        const rows = (await db_1.pool.query(query)).rows;
        return rows.map(r => r.data);
    }
    async addToCart(listingid, userid) {
        const q = `
      INSERT INTO shoppingcart(kit_listing, shopper, data)
      VALUES ($1, $2, jsonb_build_object('added', now()))
      ON CONFLICT DO NOTHING
    `;
        await db_1.pool.query({ text: q, values: [listingid, userid] });
        return listingid;
    }
    async removeFromCart(listingid, userid) {
        const q = `
      DELETE FROM shoppingcart
      WHERE kit_listing = $1 AND shopper = $2
    `;
        await db_1.pool.query({ text: q, values: [listingid, userid] });
        return listingid;
    }
    async checkInCart(listingid, userid) {
        const q = `
      SELECT 1 FROM shoppingcart
      WHERE kit_listing = $1 AND shopper = $2
    `;
        const rows = (await db_1.pool.query({ text: q, values: [listingid, userid] })).rows;
        return rows.length > 0;
    }
    async createGuestShopper() {
        const q = `
      INSERT INTO shopper(data)
      VALUES (jsonb_build_object('is_guest', true))
      RETURNING id
    `;
        const res = await db_1.pool.query({ text: q, values: [] });
        return res.rows[0].id;
    }
}
exports.CartService = CartService;
