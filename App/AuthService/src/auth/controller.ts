import { Controller, Get, Request, Response, Route, Security } from 'tsoa'
import * as express from 'express'

import { SessionUser } from '.'

@Route('check')
export class CheckController extends Controller {
  @Get()
  @Security('jwt')
  @Response('401', 'Unauthorised')
  public async get(@Request() request: express.Request): Promise<SessionUser | undefined> {
    return request.user
  }
}
