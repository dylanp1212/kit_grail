import {
  Body, Controller, Delete, Get, Path, Post, Request, Response, Route, SuccessResponse,
} from 'tsoa'
import * as express from 'express'

import { CreateKeyRequest, KeyCreated, KeyMetadata } from '.'
import { KeysService } from './service'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function jweFromRequest(request: express.Request): string | undefined {
  const cookie = (request.cookies as Record<string, unknown> | undefined)?.seller_session
  return typeof cookie === 'string' ? cookie : undefined
}

@Route('keys')
export class KeysController extends Controller {
  @Get()
  @Response('401', 'Unauthorised')
  public async list(@Request() request: express.Request): Promise<KeyMetadata[]> {
    const jwe = jweFromRequest(request)
    if (!jwe) {
      this.setStatus(401)
      return []
    }
    return new KeysService().list(jwe)
  }

  @Post()
  @SuccessResponse('201', 'Created')
  @Response('401', 'Unauthorised')
  public async create(
    @Body() body: CreateKeyRequest,
    @Request() request: express.Request,
  ): Promise<KeyCreated | undefined> {
    const jwe = jweFromRequest(request)
    if (!jwe) {
      this.setStatus(401)
      return undefined
    }
    this.setStatus(201)
    return new KeysService().create(jwe, body)
  }

  @Delete('{id}')
  @SuccessResponse('204', 'No Content')
  @Response('400', 'Invalid ID format')
  @Response('401', 'Unauthorised')
  @Response('404', 'Not found')
  public async revoke(
    @Path() id: string,
    @Request() request: express.Request,
  ): Promise<void> {
    if (!UUID_RE.test(id)) {
      this.setStatus(400)
      return
    }
    const jwe = jweFromRequest(request)
    if (!jwe) {
      this.setStatus(401)
      return
    }
    const ok = await new KeysService().revoke(jwe, id)
    this.setStatus(ok ? 204 : 404)
  }
}
