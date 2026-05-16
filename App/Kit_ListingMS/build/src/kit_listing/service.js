"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingService = void 0;
const db_1 = require("../db");
const getAllHelper = async (vals, whereClause) => {
    const q = `
    SELECT data || jsonb_build_object('id', id, 'seller', seller) AS data
    FROM kit_listing
    ${whereClause}
    ORDER BY data->>'listed' DESC
  `;
    const query = {
        text: q,
        values: vals,
    };
    const rows = (await db_1.pool.query(query)).rows;
    const listings = [];
    for (const row of rows) {
        listings.push(row.data);
    }
    return (listings);
};
class ListingService {
    async getAllKitListings(search, sellerId) {
        const conditions = [];
        const vals = [];
        if (sellerId) {
            vals.push(sellerId);
            conditions.push(`seller = $${vals.length}`);
        }
        if (search) {
            vals.push(search);
            conditions.push(`(
          SELECT bool_and(
            data->>'title' ILIKE '%' || word || '%' OR
            data->>'description' ILIKE '%' || word || '%'
          )
          FROM unnest(string_to_array($${vals.length}, ' ')) AS word
        )`);
        }
        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        return getAllHelper(vals, whereClause);
    }
    async getKitListingById(id) {
        const q = `
      SELECT data || jsonb_build_object('id', id, 'seller', seller) AS data
      FROM kit_listing
      WHERE id = $1
    `;
        const query = {
            text: q,
            values: [id],
        };
        const res = await db_1.pool.query(query);
        if (res.rowCount === 0) {
            return null;
        }
        return res.rows[0].data;
    }
    async createNewKitListing(newListing) {
        const q = `
      INSERT INTO kit_listing(seller, data)
      VALUES ($1::uuid,
        jsonb_build_object(
          'title', $2::text,
          'description', $3::text,
          'size', $4::text,
          'colors', $5::text[],
          'listed', NOW(),
          'price', $6::numeric,
          'image', $7::text
        )
      )
      RETURNING data || jsonb_build_object('id', id, 'seller', seller) AS data
    `;
        const img = newListing.image ?? 'http://localhost:3000/blankJersey.jpg';
        const query = {
            text: q,
            values: [newListing.seller, newListing.title, newListing.description,
                newListing.size, newListing.colors, newListing.price, img],
        };
        const rows = (await db_1.pool.query(query)).rows;
        return (rows[0].data);
    }
}
exports.ListingService = ListingService;
