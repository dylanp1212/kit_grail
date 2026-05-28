// import { pool } from '../db';
import { Midt } from '..';
import { MyListings, NewListing } from '.';

const MS_URL = 'http://localhost:3011/api/v0/kit-listing'

export class ListingService {
  // private rowToListing(row: ListingRow): MyListings {
  //   return {
  //     id: row.id,
  //     title: row.data.title,
  //     description: row.data.description,
  //     size: row.data.size,
  //     colors: row.data.colors,
  //     listed: row.data.listed,
  //     price: row.data.price,
  //     // change this later on; temp image
  //     image: row.data.image.replace(/^https?:\/\/localhost:\d+/, '')
  //   };
  // }

  public async getMyListings(userID: Midt): Promise<MyListings[]> {
    // const getQuery = `
    //   SELECT *
    //   FROM kit_listing
    //   WHERE seller = $1
    // `;

    // const query = {
    //   text: getQuery,
    //   values: [userID]
    // };

    // const {rows} = await pool.query<ListingRow>(query);

    // const myListings: MyListings[] = rows.map((row: ListingRow) => this.rowToListing(row))

    // return myListings;
    // const url = search ? `${MS_URL}?search=${encodeURIComponent(search)}` : MS_URL
    const params = new URLSearchParams()
    // if (search) params.set('search', search)
    params.set('sellerId', userID)
    const qs = params.toString()
    const res = await fetch(`${MS_URL}?${qs}`)
    return res.json() as Promise<MyListings[]>
  }

  public async getListing(listingID: string): Promise<MyListings | undefined> {
    // const getQuery = `
    //   SELECT *
    //   FROM kit_listing
    //   WHERE id = $1
    // `;
    // const query = {
    //   text: getQuery,
    //   values: [listingID]
    // };
    // const {rows} = await pool.query<ListingRow>(query);

    // const listing: MyListings[] = rows.map((row) => this.rowToListing(row))

    // return listing[0];
    const res = await fetch(`${MS_URL}/${listingID}`)
    if (res.status === 404) return undefined
    return res.json() as Promise<MyListings>
  }

  public async createNewListing(
    newListing: NewListing,
    jwe: string,
  ): Promise<MyListings | undefined> {
    const res = await fetch(`${MS_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwe}`,
      },
      body: JSON.stringify(newListing),
    })
    if (res.status === 400) return undefined
    return res.json() as Promise<MyListings>
  }
}