import {it, describe, beforeEach, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';

import {MyListings} from '../../src/pages/MyListingsPage';
import {getMyListings} from '../../src/api/listings';

vi.mock('../../src/api/listings', () => ({
  getMyListings: vi.fn(),
}));

const mockedGetMyListings = vi.mocked(getMyListings);

describe('MyListingsPage', () => {
  beforeEach(() => {
    mockedGetMyListings.mockReset();
    mockedGetMyListings.mockResolvedValue([]);
  });

  it('Listings page renders', () => {
    render(<MyListings />);
  });

  it('Initial render shows "My Listings"', async () => {
    render(<MyListings />);
    expect(await screen.findByText('My Listings')).toBeInTheDocument();
  });

  it('Shows empty state when no listings', async () => {
    mockedGetMyListings.mockResolvedValue([]);
    render(<MyListings />);
    expect(await screen.findByText(/no listings yet/i)).toBeInTheDocument();
  });

  it('Renders listing data when API returns listings', async () => {
    mockedGetMyListings.mockResolvedValue([
      {
        id: 'listing-1',
        title: 'Vintage Tee',
        description: 'A classic',
        size: 'M',
        colors: ['red', 'white'],
        listed: true,
        price: 25,
        image: 'https://example.com/tee.jpg',
      },
    ]);
    render(<MyListings />);
    expect(await screen.findByText('Vintage Tee')).toBeInTheDocument();
  });

  it('Bad API route gives error', async () => {
    mockedGetMyListings.mockRejectedValue(new Error('Failed: 500'));
    render(<MyListings />);
    expect(await screen.findByText(/Error: Failed: 500/i)).toBeInTheDocument();
  });
});
