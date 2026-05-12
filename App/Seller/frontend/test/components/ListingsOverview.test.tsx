import {it, describe, expect, beforeEach, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {sampleListing} from '../fixtures/listings';
import {ListingsOverview} from '../../src/components/ListingsOverview';
import {getMyListings} from '../../src/api/listings';

vi.mock('../../src/api/listings', () => ({
  getMyListings: vi.fn(),
}));

const mockedGetMyListings = vi.mocked(getMyListings);

describe('Listings Overview', () => {
  beforeEach(() => {
    mockedGetMyListings.mockReset();
    mockedGetMyListings.mockResolvedValue([]);
  });

  it('Active listings table renders', () => {
    render(<ListingsOverview />);
  });

  it('First listing is rendered correctly', async () => {
    mockedGetMyListings.mockResolvedValue([sampleListing]);
    render(<ListingsOverview />);
    expect(await screen.findByText('Vintage Tee')).toBeInTheDocument();
  });

  it('No listings shows proper message', async () => {
    mockedGetMyListings.mockResolvedValue([]);
    render(<ListingsOverview />);
    expect(await screen.findByText('No listings yet.')).toBeInTheDocument();
  });

  it('Error message displayed properly', async () => {
    mockedGetMyListings.mockRejectedValue(new Error('Failed: 500'));
    render(<ListingsOverview />);
    expect(await screen.findByText(/Error: Failed: 500/i)).toBeInTheDocument();
  });
});
