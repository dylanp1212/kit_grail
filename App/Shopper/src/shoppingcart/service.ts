// needed to not get error in testing environment
const isTest = process.env.NODE_ENV === 'test';
if (!isTest) {
  await import('server-only');
}

import { pool } from '../db'
import { CartItem } from '.'

interface rowreturn {
  data: CartItem,
}

export class CartService {
    public async getAllCartItems(userid: string): Promise<CartItem[]> {
    const q = `
      SELECT kl.data || jsonb_build_object('id', kl.id) AS data
      FROM kit_listing kl JOIN shoppingcart w ON kl.id = w.kit_listing
      WHERE w.shopper = $1
    `;
    const rows = (await pool.query<rowreturn>({text: q, values: [userid]})).rows;
    return rows.map((row) => row.data);
  }

  public async addToCart(kitListingId: string, shopperId: string): Promise<void> {
    const q = `
      INSERT INTO shoppingcart(kit_listing, shopper, data)
      VALUES ($1, $2, jsonb_build_object('added', now()))
      ON CONFLICT (kit_listing, shopper) DO NOTHING
    `;
    await pool.query({text: q, values: [kitListingId, shopperId]});
  }

  public async removeFromCart(kitListingId: string, shopperId: string): Promise<void> {
    const q = `
      DELETE FROM shoppingcart
      WHERE kit_listing = $1 AND shopper = $2
    `;
    await pool.query({text: q, values: [kitListingId, shopperId]});
  }
}