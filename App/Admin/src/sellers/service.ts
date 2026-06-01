import { pool } from '../db'
import { Seller } from '.'

interface SellerRow {
  id: string
  email: string
  name: string
  suspended: string | null
}

export class SellerService {
  public async getAllSellers(): Promise<Seller[]> {
    const { rows } = await pool.query<SellerRow>(
      `SELECT id,
              data->>'email' AS email,
              data->>'name'  AS name,
              data->>'suspended' AS suspended
       FROM seller
       ORDER BY data->>'name'`
    )
    return rows.map((r) => ({
      id: r.id,
      email: r.email,
      name: r.name,
      suspended: r.suspended === 'true',
    }))
  }

  public async setSuspended(id: string, suspended: boolean): Promise<void> {
    await pool.query(
      `UPDATE seller SET data = data || $1::jsonb WHERE id = $2`,
      [JSON.stringify({ suspended }), id],
    )
  }
}
