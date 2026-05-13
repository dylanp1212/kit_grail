import {it, describe, expect, beforeEach, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {sampleListing} from '../fixtures/listings';
import {ListingsOverview} from '../../src/components/ListingsOverview';
import {getAllListings} from '../../src/api/listings';

vi.mock('../../src/api/listings', () => ({
  getAllListings: vi.fn(),
}));

const mockedGetAllListings = vi.mocked(getAllListings);

describe('Listings Overview', () => {
  beforeEach(() => {
    mockedGetAllListings.mockReset();
    mockedGetAllListings.mockResolvedValue([]);
  });

  it('Active listings table renders', () => {
    render(
        <MemoryRouter>
          <ListingsOverview />
        </MemoryRouter>,
    );
  });

  it('First listing is rendered correctly', async () => {
    mockedGetAllListings.mockResolvedValue([sampleListing]);
    render(
        <MemoryRouter>
          <ListingsOverview />
        </MemoryRouter>,
    );
    expect(await screen.findByText('Vintage Tee')).toBeInTheDocument();
  });

  it('No listings shows proper message', async () => {
    mockedGetAllListings.mockResolvedValue([]);
    render(
        <MemoryRouter>
          <ListingsOverview />
        </MemoryRouter>,
    );
    expect(await screen.findByText('No listings yet.')).toBeInTheDocument();
  });

  it('Error message displayed properly', async () => {
    mockedGetAllListings.mockRejectedValue(new Error('Failed: 500'));
    render(
        <MemoryRouter>
          <ListingsOverview />
        </MemoryRouter>,
    );
    expect(await screen.findByText(/Error: Failed: 500/i)).toBeInTheDocument();
  });
});
