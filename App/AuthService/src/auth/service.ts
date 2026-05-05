import { EncryptJWT, jwtDecrypt } from 'jose'

import { Authenticated, SessionUser } from '.'
import { pool } from '../db'
import { exchangeCodeForTokens, fetchGoogleProfile } from '../google'

if (!process.env.SECRET) {
  throw new Error('SECRET env var is required')
}

const TEXT_ENCODED_SECRET = new TextEncoder().encode(process.env.SECRET)
const JWE_ALGORITHM = 'A128CBC-HS256'

export class AuthService {
  public async issue(payload: SessionUser): Promise<string> {
    return new EncryptJWT({ ...payload })
      .setProtectedHeader({ alg: 'dir', enc: JWE_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime('2h')
      .encrypt(TEXT_ENCODED_SECRET)
  }

  public async check(authHeader?: string): Promise<SessionUser> {
    if (!authHeader) {
      throw new Error('Unauthorized')
    }
    const token = authHeader.split(' ')[1]
    if (!token) {
      throw new Error('Unauthorized')
    }
    const { payload } = await jwtDecrypt<SessionUser>(token, TEXT_ENCODED_SECRET, {
      contentEncryptionAlgorithms: [JWE_ALGORITHM],
    })
    return { id: payload.id, email: payload.email, name: payload.name }
  }

  public async exchangeGoogle(code: string, redirectUri: string): Promise<Authenticated> {
    const tokens = await exchangeCodeForTokens(code, redirectUri)
    const profile = await fetchGoogleProfile(tokens.access_token)

    const existing = await pool.query<{ id: string }>(
      `SELECT id FROM shopper WHERE data->>'google_sub' = $1 LIMIT 1`,
      [profile.sub],
    )

    let shopperId: string
    if (existing.rowCount && existing.rowCount > 0) {
      shopperId = existing.rows[0].id
      await pool.query(
        `UPDATE shopper SET data = data || $1::jsonb WHERE id = $2`,
        [JSON.stringify({ email: profile.email, name: profile.name }), shopperId],
      )
    } else {
      const inserted = await pool.query<{ id: string }>(
        `INSERT INTO shopper(data) VALUES ($1::jsonb) RETURNING id`,
        [JSON.stringify({ email: profile.email, name: profile.name, google_sub: profile.sub })],
      )
      shopperId = inserted.rows[0].id
    }

    const accessToken = await this.issue({
      id: shopperId,
      email: profile.email,
      name: profile.name,
    })
    return { name: profile.name, accessToken }
  }
}
