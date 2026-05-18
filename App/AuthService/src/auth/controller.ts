import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  Route,
  Security,
} from 'tsoa'
import * as express from 'express'

import { Authenticated, ExchangeRequest, SessionUser } from '.'
import { AuthService } from './service'

@Route()
export class AuthController extends Controller {
  @Get('check')
  @Security('jwt')
  @Response('401', 'Unauthorised')
  public async check(@Request() request: express.Request): Promise<SessionUser | undefined> {
    return request.user
  }

  @Post('auth/google/exchange')
  @Response('401', 'Unauthorised')
  public async exchange(@Body() body: ExchangeRequest): Promise<Authenticated | undefined> {
    try {
      return await new AuthService().exchangeGoogle(body.code, body.redirectUri)
    } catch {
      this.setStatus(401)
      return undefined
    }
  }

  @Post('auth/google/exchange/seller')
  @Response('401', 'Unauthorised')
  public async exchangeSeller(@Body() body: ExchangeRequest): Promise<Authenticated | undefined> {
    try {
      return await new AuthService().exchangeGoogleSeller(body.code, body.redirectUri)
    } catch {
      this.setStatus(401)
      return undefined
    }
  }
}
