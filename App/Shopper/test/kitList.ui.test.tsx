import {it, vi, expect} from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'
import KitList from '../src/app/listings/kitList'
import {mockListings} from '../vitest.setup'
import {useSearchParams} from 'next/navigation'
import * as actions from '../src/kit_listing/actions'
import {routerSpy} from './mockRouter'


it('has first listing title', async () => {
  render(<KitList />)
  const title0 = await screen.findByText(mockListings[0].title)
  expect(title0).not.toBeNull();
});

it('has second listing title', async () => {
  render(<KitList />)
  const title1 = await screen.findByText(mockListings[1].title)
  expect(title1).not.toBeNull();
});

it('has third listing title', async () => {
  render(<KitList />)
  const title2 = await screen.findByText(mockListings[2].title)
  expect(title2).not.toBeNull();
});

it('shows no results message with empty list', async () => {
  vi.spyOn(actions, 'getAllKitListings').mockResolvedValueOnce([])
  render(<KitList />)
  const message = await screen.findByText(`Hmm, we can't find anything like that...`)
  expect(message).not.toBeNull();
});

it('clears search results on press clear', async () => {
  vi.spyOn(actions, 'getAllKitListings').mockResolvedValueOnce([])
  render(<KitList />)
  const clear = await screen.findByText('Clear search')
  fireEvent.click(clear)
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith('?search=')
  })
});
