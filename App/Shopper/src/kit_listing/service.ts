import { pool } from '../db'
import { KitListing } from '.'

export async function getListings(): Promise<KitListing[]> {
  const { rows } = await pool.query(`
    SELECT
      seller,
      data->>'title'       AS title,
      data->>'description' AS description,
      data->>'size'        AS size,
      data->'colors'       AS colors
    FROM kit_listing
  `)
  return rows
}
