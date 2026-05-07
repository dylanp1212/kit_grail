import {it, expect, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import WishList from '../src/app/wishlist/wishList'
import {mockItems} from '../vitest.setup'
import {useSearchParams} from 'next/navigation'
import * as actions from '../src/kit_listing/actions'
import {routerSpy} from './mockRouter'

it('has first item title', async () => {
  render(<WishList />)
  const title0 = await screen.findByText(mockItems[0].title)
  expect(title0).not.toBeNull();
});

it('has second item title', async () => {
  render(<WishList />)
  const title1 = await screen.findByText(mockItems[1].title)
  expect(title1).not.toBeNull();
});

it('has third item title', async () => {
  render(<WishList />)
  const title2 = await screen.findByText(mockItems[2].title)
  expect(title2).not.toBeNull();
});

it('shows no results message with empty list', async () => {
  vi.spyOn(actions, 'getAllKitListings').mockResolvedValueOnce([])
  render(<WishList />)
  const m = await screen.findByText(`Hmm, we can't find anything like that...`)
  expect(m).not.toBeNull();
});