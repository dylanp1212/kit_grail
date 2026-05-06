import { pool } from '../db';
import { Midt } from '..';
import { MyListings, ListingRow } from '.';

export class ListingService {
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

    const myListings: MyListings[] = rows.map((row: ListingRow) => {
      return {
        id: row.id,
        title: row.data.title,
        description: row.data.description,
        size: row.data.size,
        colors: row.data.colors,
        listed: row.data.listed,
        price: row.data.price,
        image: row.data.image
      }
    })


    return myListings;
  }
}