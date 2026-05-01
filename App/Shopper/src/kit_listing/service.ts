import 'server-only'

import { pool } from '../db'
import { KitListing } from '.'

// export async function getAllListings(): Promise<KitListing[]> {
//   const { rows } = await pool.query(`
//     SELECT
//       seller,
//       data->>'title'       AS title,
//       data->>'description' AS description,
//       data->>'size'        AS size,
//       data->'colors'       AS colors
//     FROM kit_listing
//   `)
//   return rows
// }

export class ListingService {
  public async getAllKitListings(): Promise<KitListing[]> {
    const q = `
      SELECT data || jsonb_build_object('id', id) AS data
      FROM kit_listing
      ORDER BY data->>'listed' DESC
    `;
    const query = {
      text: q,
      values: [],
    };
    const rows = (await pool.query<rowreturn>(query)).rows;
    const listings = [];
    for (const row of rows) {
      listings.push(row.data);
    }
    // console.log(listings);
    return(listings);
  }
}
