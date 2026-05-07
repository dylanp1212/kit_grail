import { vi, it, beforeEach, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {useSearchParams} from 'next/navigation'
import View from '../src/app/viewlisting/View'
import { mockListings } from '../vitest.setup'
import {routerSpy} from './mockRouter'


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

it('renders not found on no id', async () => {
  vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams(''))
  render(<View />)
  screen.getByText(`Oops, looks like we can't find that right now!`)
})

it('renders not found onbad id', async () => {
  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams('not-a-uuid')
  )
  render(<View />)
  screen.getByText(`Oops, looks like we can't find that right now!`)
})

it('goes home from not found on click back', async () => {
  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams('another-bad-uuid')
  )
  render(<View />)
  const back = screen.getByText('Back to shop')
  fireEvent.click(back)
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith('/listings')
  })
})