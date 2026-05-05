import { Request } from 'express'

import { AuthService } from './service'
import { SessionUser } from '.'

export function expressAuthentication(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  securityName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scopes?: string[],
): Promise<SessionUser> {
  return new AuthService().check(request.headers.authorization)
}
