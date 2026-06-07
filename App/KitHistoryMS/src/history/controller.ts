import {Controller, Get, Path, Response, Route} from 'tsoa'

import {ListingHistory} from '.'
import {HistoryService} from './service'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

@Route('history')
export class HistoryController extends Controller {
  @Get('listings/{id}')
  @Response('400', 'Invalid listing id')
  @Response('404', 'No cached history for this listing yet')
  public async getListingHistory(
    @Path() id: string,
  ): Promise<ListingHistory | undefined> {
    if (!UUID_RE.test(id)) {
      this.setStatus(400)
      return undefined
    }
    const cached = await new HistoryService().getCached(id)
    if (!cached) {
      this.setStatus(404)
      return undefined
    }
    return cached
  }
}
