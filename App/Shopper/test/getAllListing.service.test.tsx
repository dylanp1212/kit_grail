
import { it, expect } from 'vitest'
import { getAllKitListings } from '../src/kit_listing/actions'


it('Gets all listings returns an array', async () => {
    const res = await getAllKitListings()
    expect(res).toBeInstanceOf(Array)
})

it('Gets all listings returns known listing', async () => {
    const res = await getAllKitListings()
    expect(res).toContainEqual(
      expect.objectContaining({ title: '2014 Argentina Messi Jersey' })
    )
})