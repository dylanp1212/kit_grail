import { pool } from '../db'
import { KitListing, KitListingPatch, NewKitListing } from '.'

interface rowreturn {
  data: KitListing,
}

const getAllHelper = async (vals: string[], whereClause: string): Promise<KitListing[]> => {
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
  const rows = (await pool.query<rowreturn>(query)).rows;
  const listings = [];
  for (const row of rows) {
    listings.push(row.data);
  }
  // console.log(listings);
  return(listings);
}

export class ListingService {
  public async getAllKitListings(search?: string, sellerId?: string): Promise<KitListing[]> {
    const conditions: string[] = []
    const vals: string[] = []

    if (sellerId) {
      vals.push(sellerId)
      conditions.push(`seller = $${vals.length}`)
    }
    if (search) {
      vals.push(search)
      conditions.push(`(
          SELECT bool_and(
            data->>'title' ILIKE '%' || word || '%' OR
            data->>'description' ILIKE '%' || word || '%'
          )
          FROM unnest(string_to_array($${vals.length}, ' ')) AS word
        )`)
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    return getAllHelper(vals, whereClause)
  }

  // passing id as query may not be best practice... come back to this
  // I believe this is fine but should be authenticated
  public async getKitListingById(id: string): Promise<KitListing | null> {
    const q = `
      SELECT data || jsonb_build_object('id', id, 'seller', seller) AS data
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
    // console.log(res.rows[0].data);
    return res.rows[0].data;
  }

  public async createNewKitListing(newListing: NewKitListing): Promise<KitListing> {
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
    const img = newListing.image ?? '/blankJersey.jpg'
    const query = {
      text: q,
      values: [newListing.seller, newListing.title, newListing.description,
        newListing.size, newListing.colors, newListing.price, img],
    };
    const rows = (await pool.query<rowreturn>(query)).rows;
    // if (res.rowCount === 0) {
    //   return null;
    // }
    // console.log(res.rows[0].data);
    return (rows[0].data)
  }

  public async editKitListing(
    listingID: string,
    userID: string,
    listing: KitListingPatch
  ): Promise<KitListing> {
    const q = `
      UPDATE kit_listing
      SET data = data || $1::jsonb
      WHERE id = $2
      RETURNING data || jsonb_build_object('id', id, 'seller', seller) AS data
    ;`;

    const query = {
      text: q,
      values: [JSON.stringify(listing), listingID]
    }

    const {rows} = await pool.query(query);
    return rows[0].data;
  }
}
