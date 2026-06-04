import {pool} from '../db'
import {SessionUser} from '../auth'

export class ProfileService {
  public async getPicture(user: SessionUser): Promise<string | undefined> {
    const table = user.role === 'seller' ? 'seller' : 'shopper'
    const res = await pool.query<{picture: string | null}>(
      `SELECT data->>'picture' AS picture FROM ${table} WHERE id = $1`,
      [user.id],
    )
    return res.rows[0]?.picture ?? undefined
  }

  public async updatePicture(user: SessionUser, url: string): Promise<void> {
    const table = user.role === 'seller' ? 'seller' : 'shopper'
    const sub = await pool.query<{sub: string | null}>(
      `SELECT data->>'google_sub' AS sub FROM ${table} WHERE id = $1`,
      [user.id],
    )
    const googleSub = sub.rows[0]?.sub
    await pool.query(
      `UPDATE shopper SET data = data || jsonb_build_object('picture', $1::text) WHERE data->>'google_sub' = $2`,
      [url, googleSub],
    )
    await pool.query(
      `UPDATE seller SET data = data || jsonb_build_object('picture', $1::text) WHERE data->>'google_sub' = $2`,
      [url, googleSub],
    )
  }
}
