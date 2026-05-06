import { it } from 'vitest'
import { render, screen } from '@testing-library/react'
import View from '../src/app/viewlisting/View'
import { mockListings } from '../vitest.setup'

const listing = mockListings[0]

it('renders viewlisting page', async () => {
  render(await View({ id: listing.id }))
})

it('renders correct title', async () => {
  render(await View({ id: listing.id }))
  screen.getByText(listing.title)
})

it('renders correct description', async () => {
  render(await View({ id: listing.id }))
  screen.getByText(listing.description)
})

it('renders correct price', async () => {
  render(await View({ id: listing.id }))
  screen.getByText(`$${listing.price.toFixed(2)}`)
})
