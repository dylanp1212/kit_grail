import {vi, it, expect} from 'vitest'
import {routerSpy} from './mockRouter'
import {render, screen, fireEvent} from '@testing-library/react'
import WishListItem from '../src/app/wishlist/wishListItem'
import {mockItems} from '../vitest.setup'


it('has correct title', async () => {
  // console.log(mockItems[1])
  render(<WishListItem item={mockItems[1]} onRemove={() => {}} />)
  const title = await screen.findByText('Busquets Spain Home Jersey 2010')
  expect(title).not.toBeNull();
});

it('has correct price', async () => {
  render(<WishListItem item={mockItems[1]} onRemove={() => {}} />)
  const price = await screen.findByText('$130')
  expect(price).not.toBeNull();
});

it('routes to detail page on clicking listing', async () => {
  render(<WishListItem item={mockItems[1]} onRemove={() => {}} />)
  const target = await screen.findByText('Busquets Spain Home Jersey 2010')
  fireEvent.click(target);
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith(`/viewlisting?id=${mockItems[1].id}`)
  })
});

const clickmenu = async () => {
  render(<WishListItem item={mockItems[1]} onRemove={() => {}} />)
  const menu = await screen.findByLabelText('menu for ' + mockItems[1].title)
  fireEvent.click(menu)
}

it('opens menu on click menu button', async () => {
  await clickmenu()
  const remove = await screen.findByText('Remove')
  expect(remove).not.toBeNull()
});

const removedisappear = async () => {
  await vi.waitFor(() => {
    const newremove = screen.queryByText('Remove')
    expect(newremove).toBeNull()
  })
}

it('closes menu on click out', async () => {
  await clickmenu()
  fireEvent.keyDown(document.activeElement ?? document, {key: 'Escape'})
  await removedisappear()
});

it('closes menu on click remove', async () => {
  await clickmenu()
  const remove = await screen.findByText('Remove')
  fireEvent.click(remove)
  await removedisappear()
});