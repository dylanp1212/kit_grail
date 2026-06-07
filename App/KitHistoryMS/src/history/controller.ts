import {Controller, Get, Path, Response, Route} from 'tsoa'

import {ListingHistory} from '.'
import {HistoryService} from './service'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

@Route('history')
export class HistoryController extends Controller {
  @Get('listings/{id}')
  @Response('400', 'Invalid listing id')
  @Response('404', 'Listing not found or no usable corpus yet')
  @Response('503', 'Generation failed; try again later')
  public async getListingHistory(
    @Path() id: string,
  ): Promise<ListingHistory | undefined> {
    if (!UUID_RE.test(id)) {
      this.setStatus(400)
      return undefined
    }
    const svc = new HistoryService()
    const cached = await svc.getCached(id)
    if (cached) return cached
    try {
      const generated = await svc.generateForListing(id)
      if (!generated) {
        this.setStatus(404)
        return undefined
      }
      return generated
    } catch {
      this.setStatus(503)
      return undefined
    }
  }
}
