"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingService = void 0;
const db_1 = require("../db");
class ListingService {
    async getMyListings(userID) {
        const getQuery = `
      SELECT *
      FROM kit_listing
      WHERE seller = $1
    `;
        const query = {
            text: getQuery,
            values: [userID]
        };
        const { rows } = await db_1.pool.query(query);
        const myListings = rows.map((row) => {
            return {
                id: row.id,
                title: row.data.title,
                description: row.data.description,
                size: row.data.size,
                colors: row.data.colors,
                listed: row.data.listed,
                price: row.data.price,
                image: row.data.image.replace(/^https?:\/\/localhost:\d+/, '')
            };
        });
        return myListings;
    }
}
exports.ListingService = ListingService;
