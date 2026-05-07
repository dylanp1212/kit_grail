import {vi, it, expect} from 'vitest'
// import {routerSpy} from './mockRouter'
import {render, screen} from '@testing-library/react'
import WishlistButton from '../src/components/wishlistButton'
import {mockListings} from '../vitest.setup'

it('adds to wislist when clicking wishlist button logged in', async () => {
  render(<WishlistButton listingid={mockListings[0].id} userid={'fake-id'} />)
  const target = await screen.findByRole('button', { name: /add to wishlist/i })
  target.click();
    await vi.waitFor(() => {
      expect(screen.getByRole('button', { name: /remove from wishlist/i })).not.toBeNull();
    });
});

it('removes from wislist when clicking wishlist button again logged in', async () => {
  render(<WishlistButton listingid={mockListings[0].id} userid={'fake-id'}/>)
  const target = await screen.findByRole('button', { name: /add to wishlist/i })
  target.click();
  const remove = await screen.findByRole('button', { name: /remove from wishlist/i })
  remove.click();
    await vi.waitFor(() => {
      expect(screen.getByRole('button', { name: /add to wishlist/i })).not.toBeNull();
    });
});

// #######
// need to change to take to login when login implemented
// and wishlistButton updated
it('does nothing when clicking wishlist button not logged in', async () => {
  render(<WishlistButton listingid={mockListings[0].id} userid={undefined} />)
  const target = await screen.findByRole('button', { name: /add to wishlist/i })
  target.click();
  const buttonchange = await screen.queryByRole('button', { name: /remove from wishlist/i })
  expect(buttonchange).toBeNull()
});
// #######