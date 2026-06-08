import { Request } from 'express'

import { ApiKeyService } from './service'
import { JweAuthService } from './jwe'
import { AuthSeller } from '.'

export function expressAuthentication(
  request: Request,
  securityName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scopes?: string[],
): Promise<AuthSeller> {
  if (securityName === 'jwe') {
    return new JweAuthService().lookup(request.headers.authorization)
  }
  return new ApiKeyService().lookup(request.headers['x-api-key'] as string | undefined)
}
