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
});
