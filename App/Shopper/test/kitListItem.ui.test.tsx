import {vi, it, expect} from 'vitest'
import {routerSpy} from './mockRouter'
import {render, screen} from '@testing-library/react'
import KitListItem from '../src/app/listings/kitListItem'
import {mockListings} from '../vitest.setup'


it('has correct title', async () => {
  render(<KitListItem listing={mockListings[0]} />)
  const title = await screen.findByText('Messi Argentina Home Jersey 2014')
  expect(title).not.toBeNull();
});

it('has correct price', async () => {
  render(<KitListItem listing={mockListings[0]} />)
  const price = await screen.findByText('$300')
  expect(price).not.toBeNull();
});

it('has correct size', async () => {
  render(<KitListItem listing={mockListings[0]} />)
  const size = await screen.findByText('SIZE L')
  expect(size).not.toBeNull();
});

it('has add to cart button', async () => {
  render(<KitListItem listing={mockListings[0]} />)
  const atc = await screen.findByLabelText('add to cart')
  expect(atc).not.toBeNull();
});

it('has add to wihlist button', async () => {
  render(<KitListItem listing={mockListings[0]} />)
  const atw = await screen.findByLabelText('add to wishlist')
  expect(atw).not.toBeNull();
});

it('renders fine without image', async () => {
  render(<KitListItem listing={mockListings[1]} />)
  const title = await screen.findByText('Busquets Spain Home Jersey 2010')
  expect(title).not.toBeNull();
});

it('routes to detail page on clicking listing', async () => {
  render(<KitListItem listing={mockListings[0]} />)
  const target = await screen.findByText('Messi Argentina Home Jersey 2014')
  target.click();
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith(`/viewlisting?id=${mockListings[0].id}`)
  })
});

it('adds to wislist when clicking wishlist button', async () => {
  render(<KitListItem listing={mockListings[0]} />)
  const target = await screen.findByRole('button', { name: /add to wishlist/i })
  target.click();
    await vi.waitFor(() => {
      expect(screen.getByRole('button', { name: /remove from wishlist/i })).not.toBeNull();
    });
});
