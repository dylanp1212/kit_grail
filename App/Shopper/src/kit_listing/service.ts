// import 'server-only'

// needed to not get error in testing environment
const isTest = process.env.NODE_ENV === 'test';
if (!isTest) {
  await import('server-only');
}

import { KitListing } from '.'

const MS_URL = 'http://localhost:3011/api/v0/kit-listing'

export class ListingService {
  public async getAllKitListings(search?: string, sellerId?: string): Promise<KitListing[]> {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (sellerId) params.set('sellerId', sellerId)
    const qs = params.toString()
    const res = await fetch(qs ? `${MS_URL}?${qs}` : MS_URL)
    return res.json() as Promise<KitListing[]>
  }

  public async getKitListingById(id: string): Promise<KitListing | null> {
    const res = await fetch(`${MS_URL}/${id}`)
    if (res.status === 404) return null
    return res.json() as Promise<KitListing>
  }
}


// import { pool } from '../db'
// import { KitListing } from '.'

// interface rowreturn {
//   data: KitListing,
// }

// export class ListingService {
//   public async getAllKitListings(search?: string): Promise<KitListing[]> {
//     let whereClause = '';
//     const vals:string[] = [];
//     if (search) {
//       whereClause = `
//         WHERE (
//           SELECT bool_and(
//             data->>'title' ILIKE '%' || word || '%' OR
//             data->>'description' ILIKE '%' || word || '%'
//           )
//           FROM unnest(string_to_array($1, ' ')) AS word
//         )
//       `
//       vals.push(search)
//     }
//     const q = `
//       SELECT data || jsonb_build_object('id', id) AS data
//       FROM kit_listing
//       ${whereClause}
//       ORDER BY data->>'listed' DESC
//     `;
//     const query = {
//       text: q,
//       values: vals,
//     };
//     const rows = (await pool.query<rowreturn>(query)).rows;
//     const listings = [];
//     for (const row of rows) {
//       listings.push(row.data);
//     }
//     // console.log(listings);
//     return(listings);
//   }

//   // passing id as query may not be best practice... come back to this
//   // I believe this is fine but should be authenticated
//   public async getKitListingById(id: string): Promise<KitListing | null> {
//     const q = `
//       SELECT data || jsonb_build_object('id', id) AS data
//       FROM kit_listing
//       WHERE id = $1
//     `;
//     const query = {
//       text: q,
//       values: [id],
//     };
//     const res = await pool.query<rowreturn>(query);
//     if (res.rowCount === 0) {
//       return null;
//     }
//     // console.log(res.rows[0].data);
//     return res.rows[0].data;
//   }
// }
