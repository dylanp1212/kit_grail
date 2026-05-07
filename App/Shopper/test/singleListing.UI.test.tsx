import { vi, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import {useSearchParams} from 'next/navigation'
import View from '../src/app/viewlisting/View'
import { mockListings } from '../vitest.setup'

const listing = mockListings[0]

beforeEach(() => {
  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams(`id=${listing.id}`)
  )
})

it('renders viewlisting page', async () => {
  render(<View />)
})

it('renders correct title', async () => {
  render(<View />)
  await vi.waitFor(() => {
    screen.getByText(listing.title)
  })
})

it('renders correct description', async () => {
  render(<View />)
  await vi.waitFor(() => {
    screen.getByText(listing.description)
  })
})

it('renders correct price', async () => {
  render(<View />)
  await vi.waitFor(() => {
    screen.getByText(`$${listing.price.toFixed(2)}`)
  })
})

// change to not found page
it('renders no id', async () => {
  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams('')
  )
  render(<View />)
  screen.getByText('no id')
})
