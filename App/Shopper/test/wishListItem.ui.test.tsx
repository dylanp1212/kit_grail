import {vi, it, expect} from 'vitest'
import {routerSpy} from './mockRouter'
import {render, screen} from '@testing-library/react'
import WishListItem from '../src/app/wishlist/wishListItem'
import {mockItems} from '../vitest.setup'


it('has correct title', async () => {
  // console.log(mockItems[1])
  render(<WishListItem item={mockItems[1]} />)
  const title = await screen.findByText('Busquets Spain Home Jersey 2010')
  expect(title).not.toBeNull();
});

it('has correct price', async () => {
  render(<WishListItem item={mockItems[1]} />)
  const price = await screen.findByText('$130')
  expect(price).not.toBeNull();
});

it('routes to detail page on clicking listing', async () => {
  render(<WishListItem item={mockItems[1]} />)
  const target = await screen.findByText('Busquets Spain Home Jersey 2010')
  target.click();
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith(`/viewListing?id=${mockItems[1].id}`)
  })
});