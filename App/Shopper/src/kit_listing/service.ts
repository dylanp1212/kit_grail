// import 'server-only'

// needed to not get error in testing environment
const isTest = process.env.NODE_ENV === 'test';
if (!isTest) {
  await import('server-only');
}

import { pool } from '../db'
import { KitListing } from '.'

interface rowreturn {
  data: KitListing,
}

export class ListingService {
  public async getAllKitListings(search?: string): Promise<KitListing[]> {
    let whereClause = '';
    const vals:string[] = [];
    if (search) {
      whereClause = `
        WHERE (
          SELECT bool_and(
            data->>'title' ILIKE '%' || word || '%' OR
            data->>'description' ILIKE '%' || word || '%'
          )
          FROM unnest(string_to_array($1, ' ')) AS word
        )
      `
      vals.push(search)
    }
    const q = `
      SELECT data || jsonb_build_object('id', id) AS data
      FROM kit_listing
      ${whereClause}
      ORDER BY data->>'listed' DESC
    `;
    const query = {
      text: q,
      values: vals,
    };
    const rows = (await pool.query<rowreturn>(query)).rows;
    const listings = [];
    for (const row of rows) {
      listings.push(row.data);
    }
    // console.log(listings);
    return(listings);
  }
  public async getKitListingById(id: string): Promise<KitListing | null> {
    const q = `
      SELECT data || jsonb_build_object('id', id) AS data
      FROM kit_listing
      WHERE id = $1
    `;
    const query = {
      text: q,
      values: [id],
    };
    const res = await pool.query<rowreturn>(query);
    if (res.rowCount === 0) {
      return null;
    }
    console.log(res.rows[0].data);
    return res.rows[0].data;
  }
}
