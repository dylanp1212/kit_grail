import {
  // Body,
  Controller,
  // Post,
  Response,
  Route,
  Get,
  Request
} from 'tsoa';
import * as express from 'express';
import { MyListings } from '.';
import { ListingService } from './service';

@Route('my-listings')
export class ListingsController extends Controller {
  @Get()
  @Response('200', 'OK')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getMyListings(@Request() request: express.Request) : Promise<MyListings[]> {
    // const user = request.user as {id: string};
    const tempid = '1830b53f-b49a-47eb-9a0e-d133a2bf5c3a'  // hard-coded id; change later
    this.setStatus(200);
    return new ListingService().getMyListings(tempid);
  }
}