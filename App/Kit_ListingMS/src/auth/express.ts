import { Request } from 'express'

import { ApiKeyService } from './service'
import { AuthSeller } from '.'

export function expressAuthentication(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  securityName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scopes?: string[],
): Promise<AuthSeller> {
  return new ApiKeyService().lookup(request.headers.authorization)
}
