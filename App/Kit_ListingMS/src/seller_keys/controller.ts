import {
  Body, Controller, Delete, Get, Path, Post, Request, Response, Route, Security, SuccessResponse,
} from 'tsoa'
import * as express from 'express'

import { CreateKeyRequest, KeyCreated, KeyMetadata } from '.'
import { KeyManagementService } from './service'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

@Route('seller/keys')
export class SellerKeysController extends Controller {
  @Post()
  @Security('jwe')
  @SuccessResponse('201', 'Created')
  @Response('401', 'Unauthorised')
  public async create(
    @Body() body: CreateKeyRequest,
    @Request() request: express.Request,
  ): Promise<KeyCreated | undefined> {
    const sellerId = request.user?.id
    if (!sellerId) {
      this.setStatus(401)
      return undefined
    }
    this.setStatus(201)
    return new KeyManagementService().create(sellerId, body)
  }

  @Get()
  @Security('jwe')
  @Response('401', 'Unauthorised')
  public async list(@Request() request: express.Request): Promise<KeyMetadata[]> {
    const sellerId = request.user?.id
    if (!sellerId) {
      this.setStatus(401)
      return []
    }
    return new KeyManagementService().list(sellerId)
  }

  @Delete('{id}')
  @Security('jwe')
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
    const sellerId = request.user?.id
    if (!sellerId) {
      this.setStatus(401)
      return
    }
    const ok = await new KeyManagementService().revoke(sellerId, id)
    this.setStatus(ok ? 204 : 404)
  }
}
