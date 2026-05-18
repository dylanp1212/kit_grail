import { pool } from '../db'
import { WishlistItem } from './schema'

interface rowreturn {
  data: WishlistItem,
}

export class WishlistService {
  public async getAllWishlistItems(userid: string, search?: string): Promise<WishlistItem[]> {
    let searchClause = '';
    const vals:string[] = [userid];
    if (search) {
      searchClause = `
        AND (
          SELECT bool_and(
            kl.data->>'title' ILIKE '%' || word || '%' OR
            kl.data->>'description' ILIKE '%' || word || '%'
          )
          FROM unnest(string_to_array($2, ' ')) AS word
        )  
      `
      vals.push(search)
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
    const rows = (await pool.query<rowreturn>(query)).rows;
    const items = [];
    for (const row of rows) {
      items.push(row.data);
    }
    return(items);
  }
  public async addToWishlist(listingid:string, userid: string): Promise<WishlistItem|null> {
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
    const rows = (await pool.query<rowreturn>(query)).rows;
    if (rows.length < 1) {
      return (null)
    }
    return rows[0].data;
  }
  public async removeFromWishlist(listingid:string, userid: string): Promise<string> {
    const q = `
      DELETE FROM wishlist
      WHERE kit_listing = $1 AND shopper = $2
    `;
    const query = {
      text: q,
      values: [listingid, userid],
    };
    await pool.query<rowreturn>(query);
    return (listingid);
  }
  public async checkInWishlist(listingid:string, userid: string): Promise<boolean> {
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
    const rows = (await pool.query<rowreturn>(query)).rows;
    if (rows.length < 1) {
      return (false)
    } else {
      return (true)
    }
  }
}