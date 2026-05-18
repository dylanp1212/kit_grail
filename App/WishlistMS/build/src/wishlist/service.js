"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistService = void 0;
const db_1 = require("../db");
class WishlistService {
    async getAllWishlistItems(userid, search) {
        let searchClause = '';
        const vals = [userid];
        if (search) {
            searchClause = `
        AND (
          SELECT bool_and(
            kl.data->>'title' ILIKE '%' || word || '%' OR
            kl.data->>'description' ILIKE '%' || word || '%'
          )
          FROM unnest(string_to_array($2, ' ')) AS word
        )  
      `;
            vals.push(search);
        }
        const q = `
      SELECT kl.data || jsonb_build_object('id', kl.id, 'seller', kl.seller, 'added', w.data->>'added') AS data
      FROM kit_listing kl JOIN wishlist w ON kl.id = w.kit_listing
      WHERE w.shopper = $1
      ${searchClause}
      ORDER BY w.data->>'added' DESC
    `;
        const query = {
            text: q,
            values: vals,
        };
        const rows = (await db_1.pool.query(query)).rows;
        const items = [];
        for (const row of rows) {
            items.push(row.data);
        }
        return (items);
    }
    async addToWishlist(listingid, userid) {
        const q = `
      WITH inserted AS (
        INSERT INTO wishlist
        SELECT $1, $2, jsonb_build_object('added', NOW())
        WHERE EXISTS (SELECT 1 FROM kit_listing WHERE id = $1)
          AND EXISTS (SELECT 1 FROM shopper WHERE id = $2)
        ON CONFLICT DO NOTHING
        RETURNING kit_listing, data->>'added' AS added
      )
      SELECT 
        kl.data || jsonb_build_object(
          'id', kl.id,
          'seller', kl.seller,
          'added', inserted.added
        ) AS data
      FROM inserted
      JOIN kit_listing kl ON kl.id = inserted.kit_listing 
    `;
        const query = {
            text: q,
            values: [listingid, userid],
        };
        const rows = (await db_1.pool.query(query)).rows;
        if (rows.length < 1) {
            return (null);
        }
        return rows[0].data;
    }
    async removeFromWishlist(listingid, userid) {
        const q = `
      DELETE FROM wishlist
      WHERE kit_listing = $1 AND shopper = $2
    `;
        const query = {
            text: q,
            values: [listingid, userid],
        };
        await db_1.pool.query(query);
        return (listingid);
    }
    async checkInWishlist(listingid, userid) {
        const q = `
      SELECT *
      FROM wishlist
      WHERE kit_listing = $1
        AND shopper = $2
    `;
        const query = {
            text: q,
            values: [listingid, userid],
        };
        const rows = (await db_1.pool.query(query)).rows;
        if (rows.length < 1) {
            return (false);
        }
        else {
            return (true);
        }
    }
}
exports.WishlistService = WishlistService;
