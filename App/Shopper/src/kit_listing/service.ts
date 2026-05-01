// import 'server-only'

// needed to not get error in testing environment
const isTest = process.env.NODE_ENV === 'test';
if (!isTest) {
  await import('server-only');
}

import { pool } from '../db'
import { KitListing } from '.'



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
