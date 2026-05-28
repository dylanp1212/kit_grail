import { pool } from '../db'
import { CartItem } from './schema'

interface rowreturn {
  data: CartItem,
}

export class CartService {
  public async getAllCartItems(userid: string): Promise<CartItem[]> {
    const q = `
      SELECT kl.data || jsonb_build_object('id', kl.id, 'seller', kl.seller) AS data
      FROM kit_listing kl JOIN shoppingcart w ON kl.id = w.kit_listing
      WHERE w.shopper = $1
    `;
    const query = { text: q, values: [userid] };
    const rows = (await pool.query<rowreturn>(query)).rows;
    return rows.map(r => r.data);
  }

  public async addToCart(listingid: string, userid: string): Promise<string> {
    const q = `
      INSERT INTO shoppingcart(kit_listing, shopper, data)
      VALUES ($1, $2, jsonb_build_object('added', now()))
      ON CONFLICT DO NOTHING
    `;
    await pool.query({ text: q, values: [listingid, userid] });
    return listingid;
  }

  public async removeFromCart(listingid: string, userid: string): Promise<string> {
    const q = `
      DELETE FROM shoppingcart
      WHERE kit_listing = $1 AND shopper = $2
    `;
    await pool.query({ text: q, values: [listingid, userid] });
    return listingid;
  }

  public async checkInCart(listingid: string, userid: string): Promise<boolean> {
    const q = `
      SELECT 1 FROM shoppingcart
      WHERE kit_listing = $1 AND shopper = $2
    `;
    const rows = (await pool.query({ text: q, values: [listingid, userid] })).rows;
    return rows.length > 0;
  }

  public async createGuestShopper(): Promise<string> {
    const q = `
      INSERT INTO shopper(data)
      VALUES (jsonb_build_object('is_guest', true))
      RETURNING id
    `;
    const res = await pool.query<{ id: string }>({ text: q, values: [] });
    return res.rows[0].id;
  }

  public async mergeCarts(guestId: string, userId: string): Promise<boolean> {
    await pool.query({
      text: `DELETE FROM shoppingcart WHERE shopper = $1 AND kit_listing IN (SELECT kit_listing FROM shoppingcart WHERE shopper = $2)`,
      values: [guestId, userId],
    });
    await pool.query({
      text: `UPDATE shoppingcart SET shopper = $2 WHERE shopper = $1`,
      values: [guestId, userId],
    });
    await pool.query({
      text: `DELETE FROM shopper WHERE id = $1`,
      values: [guestId],
    });
    return true;
  }
}
