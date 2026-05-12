import { pool } from '../db';
import { Midt } from '..';
import { MyListings, ListingRow } from '.';

export class ListingService {
  private rowToListing(row: ListingRow): MyListings {
    return {
      id: row.id,
      title: row.data.title,
      description: row.data.description,
      size: row.data.size,
      colors: row.data.colors,
      listed: row.data.listed,
      price: row.data.price,
      // change this later on; temp image
      image: row.data.image.replace(/^https?:\/\/localhost:\d+/, '')
    };
  }

  public async getMyListings(userID: Midt): Promise<MyListings[]> {
    const getQuery = `
      SELECT *
      FROM kit_listing
      WHERE seller = $1
    `;

    const query = {
      text: getQuery,
      values: [userID]
    };

    const {rows} = await pool.query<ListingRow>(query);

    const myListings: MyListings[] = rows.map((row: ListingRow) => this.rowToListing(row))

    return myListings;
  }

  public async getListing(listingID: string): Promise<MyListings | undefined> {
    const getQuery = `
      SELECT *
      FROM kit_listing
      WHERE id = $1
    `;
    const query = {
      text: getQuery,
      values: [listingID]
    };
    const {rows} = await pool.query<ListingRow>(query);

    const listing: MyListings[] = rows.map((row) => this.rowToListing(row))

    return listing[0];
  }
}