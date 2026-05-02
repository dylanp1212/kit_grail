import { expect, it } from 'vitest'
import { ListingService } from '../src/kit_listing/service'

it('gets listing by id does not return null', async () => {
  const all = await new ListingService().getAllKitListings()
  const result = await new ListingService().getKitListingById(all[0].id)
  expect(result).not.toBeNull()
})

it('gets listing by id with correct title', async () => {
  const all = await new ListingService().getAllKitListings()
  const result = await new ListingService().getKitListingById(all[0].id)
  expect(result?.title).toBe('2014 Argentina Messi Jersey')
})

it('gets listing by id and returns correct type', async () => {
  const all = await new ListingService().getAllKitListings()
  const result = await new ListingService().getKitListingById(all[0].id)
  expect(typeof result).toBe('object')
})

it('gets listing by id and returns null for nonexistant id', async () => {
 const result = await new ListingService().getKitListingById('00000000-0000-0000-0000-000000000000')
expect(result).toBeNull()

})
