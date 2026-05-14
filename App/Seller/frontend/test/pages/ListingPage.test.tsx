import {it, describe, vi, beforeEach, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import {sampleListing} from '../fixtures/listings';
import {ListingPage} from '../../src/pages/ListingPage';
import {getListing} from '../../src/api/listings';


vi.mock('../../src/api/listings', () => ({
  getListing: vi.fn(),
}));

const mockedGetListing = vi.mocked(getListing);

const renderWithRoute = (id: string) => render(
    <MemoryRouter initialEntries={[`/listings/${id}`]}>
      <Routes>
        <Route path='/listings/:id' element={<ListingPage />} />
      </Routes>
    </MemoryRouter>,
);

describe('ListingPage', () => {
  beforeEach(() => {
    mockedGetListing.mockReset();
  });

  it('Render ListingPage', () => {
    mockedGetListing.mockResolvedValue(sampleListing);
    renderWithRoute(sampleListing.id);
  });

  it('Listing renders correctly', async () => {
    mockedGetListing.mockResolvedValue(sampleListing);
    renderWithRoute(sampleListing.id);
    expect(await screen.findByText(sampleListing.title)).toBeInTheDocument();
  });

  it('Wrong link gives error message', async () => {
    mockedGetListing.mockRejectedValue(new Error('Failed: 404'));
    renderWithRoute('bad-id');
    expect(await screen.findByText(/Error:/i)).toBeInTheDocument();
  });

  it('Wrong ID is not found', async () => {
    mockedGetListing.mockResolvedValue(null as any);
    renderWithRoute('notfound');
    expect(await screen.findByText('Listing not found.')).toBeInTheDocument();
  });

  it('Missing id shows error', async () => {
    mockedGetListing.mockResolvedValue(null as any);
    render(
        <MemoryRouter initialEntries={['/inventory']}>
          <Routes>
            <Route path='/inventory' element={<ListingPage />} />
          </Routes>
        </MemoryRouter>,
    );
    expect(await screen.findByText(/Error:/i)).toBeInTheDocument();
  });
});
