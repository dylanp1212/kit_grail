import { it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ListingCard from '../src/app/listings/ListingCard'

// mock services when single listing service is implemented
const listing = {
  seller: '1',
  title: '2014 Argentina Messi Jersey',
  description: 'Size large, blue and white',
  size: 'large',
  colors: ['blue', 'white'],
}

it('Renders ListingCard', () => {
  render(<ListingCard listing={listing} />)
})

it('Renders ListingCard with item', () => {
  render(<ListingCard listing={listing} />)
  screen.getByText('2014 Argentina Messi Jersey')
})
