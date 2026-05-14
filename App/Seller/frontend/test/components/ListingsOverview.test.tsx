import {it, describe, expect, beforeEach, vi} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {sampleListing} from '../fixtures/listings';
import {ListingsOverview} from '../../src/components/ListingsOverview';
import {getAllListings} from '../../src/api/listings';

const mockNavigate = vi.fn();

vi.mock('../../src/api/listings', () => ({
  getAllListings: vi.fn(),
}));

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}));

const mockedGetAllListings = vi.mocked(getAllListings);

describe('Listings Overview', () => {
  beforeEach(() => {
    mockedGetAllListings.mockReset();
    mockedGetAllListings.mockResolvedValue([]);
  });

  it('Active listings table renders', async () => {
    render(
        <MemoryRouter>
          <ListingsOverview />
        </MemoryRouter>,
    );
    expect(await screen.findByLabelText('active listings')).toBeInTheDocument();
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

  it('Clicking on a listing navigates to its info page', async () => {
    mockedGetAllListings.mockResolvedValue([sampleListing]);
    render(
        <MemoryRouter>
          <ListingsOverview />
        </MemoryRouter>,
    );

    fireEvent.click(await screen.findByText('Vintage Tee'));
    expect(mockNavigate).toHaveBeenCalledWith('/inventory/listing-1');
  });
});
