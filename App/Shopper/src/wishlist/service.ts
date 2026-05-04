// needed to not get error in testing environment
const isTest = process.env.NODE_ENV === 'test';
if (!isTest) {
  await import('server-only');
}

import { pool } from '../db'
import { WishlistItem } from '.'

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
      SELECT kl.data || jsonb_build_object('id', kl.id) 
        || jsonb_build_object('added', w.data->>'added') AS data
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
}
