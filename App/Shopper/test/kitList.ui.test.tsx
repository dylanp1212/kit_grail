import {it, expect} from 'vitest'
import {render, screen} from '@testing-library/react'
import KitList from '../src/components/kitList'
import {mockListings} from '../vitest.setup'

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
