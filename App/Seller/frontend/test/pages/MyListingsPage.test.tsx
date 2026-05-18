import {it, describe, beforeEach, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import {MyListings} from '../../src/pages/MyListingsPage';
import {getAllListings} from '../../src/api/listings';
import {sampleListing} from '../fixtures/listings';
import {SellerContext} from '../../src/context/SellerContext';
import {fakeUser} from '../fixtures/listings';

vi.mock('../../src/api/listings', () => ({
  getAllListings: vi.fn(),
}));

const mockedGetAllListings = vi.mocked(getAllListings);

describe('MyListingsPage', () => {
  beforeEach(() => {
    mockedGetAllListings.mockReset();
    mockedGetAllListings.mockResolvedValue([]);
  });

  it('Listings page renders', () => {
    render(
        <MemoryRouter>
          <SellerContext.Provider value={fakeUser}>
            <MyListings />
          </SellerContext.Provider>
        </MemoryRouter>,
    );
  });

  it('Initial render shows "My Listings"', async () => {
    render(
        <MemoryRouter>
          <SellerContext.Provider value={fakeUser}>
            <MyListings />
          </SellerContext.Provider>
        </MemoryRouter>,
    );
    expect(await screen.findByText('My Listings')).toBeInTheDocument();
  });

  it('Shows empty state when no listings', async () => {
    mockedGetAllListings.mockResolvedValue([]);
    render(
        <MemoryRouter>
          <SellerContext.Provider value={fakeUser}>
            <MyListings />
          </SellerContext.Provider>
        </MemoryRouter>,
    );
    expect(await screen.findByText(/no listings yet/i)).toBeInTheDocument();
  });

  it('Renders listing data when API returns listings', async () => {
    mockedGetAllListings.mockResolvedValue([sampleListing]);
    render(
        <MemoryRouter>
          <SellerContext.Provider value={fakeUser}>
            <MyListings />
          </SellerContext.Provider>
        </MemoryRouter>,
    );
    expect(await screen.findByText('Vintage Tee')).toBeInTheDocument();
  });

  it('Bad API route gives error', async () => {
    mockedGetAllListings.mockRejectedValue(new Error('Failed: 500'));
    render(
        <MemoryRouter>
          <SellerContext.Provider value={fakeUser}>
            <MyListings />
          </SellerContext.Provider>
        </MemoryRouter>,
    );
    expect(await screen.findByText(/Error: Failed: 500/i)).toBeInTheDocument();
  });
});
