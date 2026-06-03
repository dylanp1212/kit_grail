import {expect, it} from 'vitest'
import {CheckoutService} from '../src/checkout/service'

const LISTING_A = '5e25b4f0-2ef4-4ec0-8ae0-e97ca701eb74'

it('makes listing unavailable', async () => {
  await new CheckoutService().decrementQuantities([LISTING_A])
  await expect(new CheckoutService().assertQuantityAvailable([LISTING_A])).rejects.toThrow()
})

it('does not go below 0', async () => {
  await new CheckoutService().decrementQuantities([LISTING_A])
  await new CheckoutService().decrementQuantities([LISTING_A])
  await expect(new CheckoutService().assertQuantityAvailable([LISTING_A])).rejects.toThrow()
})
