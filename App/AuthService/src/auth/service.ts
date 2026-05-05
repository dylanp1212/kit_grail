import { EncryptJWT, jwtDecrypt } from 'jose'

import { SessionUser } from '.'

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
}
