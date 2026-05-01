
import { it, expect } from 'vitest'
import { getAllListings } from '../src/app/listings/actions'


it('Gets all listings returns an array', async () => {
    const res = await getAllListings()
    expect(res).toBeInstanceOf(Array)
})

it('Gets all listings returns known listing', async () => {
    const res = await getAllListings()
    expect(res).toContainEqual(
      expect.objectContaining({ title: '2014 Argentina Messi Jersey' })
    )
})