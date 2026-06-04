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
    async getAllKitListings(search, sellerId, options) {
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
        if (options?.sizes && options.sizes.length > 0) {
            vals.push(options.sizes);
            conditions.push(`data->>'size' = ANY($${vals.length}::text[])`);
        }
        if (options?.colors && options.colors.length > 0) {
            vals.push(options.colors);
            conditions.push(`EXISTS (SELECT 1 FROM jsonb_array_elements_text(data->'colors') c WHERE c = ANY($${vals.length}::text[]))`);
        }
        if (!options?.includeAll) {
            conditions.push(`COALESCE((data->>'quantity')::int, 1) > 0`);
        }
        const whereClause = `WHERE ${conditions.join(' AND ')}`;
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
          'image', $7::text,
          'quantity', $8::numeric
        )
      )
      RETURNING data || jsonb_build_object('id', id, 'seller', seller) AS data
    `;
        const img = newListing.image ?? '/blankJersey.jpg';
        const query = {
            text: q,
            values: [newListing.seller, newListing.title, newListing.description,
                newListing.size, newListing.colors, newListing.price, img, newListing.quantity],
        };
        const rows = (await db_1.pool.query(query)).rows;
        return (rows[0].data);
    }
    async editKitListing(listingID, userID, listing) {
        const q = `
      UPDATE kit_listing
      SET data = data || $1::jsonb
      WHERE id = $2
      RETURNING data || jsonb_build_object('id', id, 'seller', seller) AS data
    ;`;
        const query = {
            text: q,
            values: [JSON.stringify(listing), listingID]
        };
        const { rows } = await db_1.pool.query(query);
        return rows[0].data;
    }
}
exports.ListingService = ListingService;
