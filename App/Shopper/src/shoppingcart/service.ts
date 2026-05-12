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
    const query = {
      text: q,
      values: [userid],
    };
    const rows = (await pool.query<rowreturn>(query)).rows;
    const items = [];
    for (const row of rows) {
      items.push(row.data);
    }
    return (items);
  }

  public async addToCart(listingid: string, userid: string): Promise<string> {
    const q = `
      INSERT INTO shoppingcart(kit_listing, shopper, data)
      VALUES ($1, $2, jsonb_build_object('added', now()))
    `;
    const query = {
      text: q,
      values: [listingid, userid],
    };
    await pool.query<rowreturn>(query);
    return listingid;
  }

  public async removeFromCart(listingid: string, userid: string): Promise<string> {
    const q = `
      DELETE FROM shoppingcart
      WHERE kit_listing = $1 AND shopper = $2
    `;
    const query = {
      text: q,
      values: [listingid, userid],
    };
    await pool.query<rowreturn>(query);
    return (listingid);
  }


public async checkInCart(listingid:string, userid: string): Promise<boolean> {
    const q = `
      SELECT *
      FROM shoppingcart
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
// create guest shopper for guest shopping cart
  public async createGuestShopper(): Promise<string> {
    const q = `
      INSERT INTO shopper(data)
      VALUES (jsonb_build_object('is_guest', true))
      RETURNING id
    `;
    const query = {
      text: q,
      values: [],
    };
    const res = await pool.query<{id: string}>(query);
    return res.rows[0].id;
  }
}
