import {
  Body,
  Controller,
  Post,
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

  public async getMyListings(@Request() request: express.Request) : Promise<MyListings[]> {
    console.log('request')
    // const user = request.user as {id: string};
    const tempid = '1830b53f-b49a-47eb-9a0e-d133a2bf5c3a'
    this.setStatus(200);
    return new ListingService().getMyListings(tempid);
  }
}