import {Body, Controller, Get, Put, Request, Response, Route, Security} from 'tsoa'
import * as express from 'express'

import {ProfileService} from './service'

interface ProfilePicture {
  picture: string | undefined
}

interface UpdatePictureRequest {
  url: string
}

@Route('profile')
export class ProfileController extends Controller {
  @Get('picture')
  @Security('jwt')
  @Response('401', 'Unauthorised')
  public async getPicture(@Request() request: express.Request): Promise<ProfilePicture> {
    const picture = await new ProfileService().getPicture(request.user)
    return {picture}
  }

  @Put('picture')
  @Security('jwt')
  @Response('401', 'Unauthorised')
  public async updatePicture(
    @Request() request: express.Request,
    @Body() body: UpdatePictureRequest,
  ): Promise<ProfilePicture> {
    await new ProfileService().updatePicture(request.user, body.url)
    return {picture: body.url}
  }
}
