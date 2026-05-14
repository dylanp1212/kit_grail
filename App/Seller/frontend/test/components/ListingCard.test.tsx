import {it, describe, expect, vi} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {sampleListing} from '../fixtures/listings';

import {ListingCard} from '../../src/components/ListingCard';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}));

describe('ListingCard', () => {
  it('Render ListingCard', () => {
    render(
        <MemoryRouter>
          <ListingCard listings={[]} />
        </MemoryRouter>,
    );
  });

  it('Clicking on a listing navigates to its page', () => {
    render(
        <MemoryRouter>
          <ListingCard listings={[sampleListing]} />
        </MemoryRouter>,
    );

    fireEvent.click(screen.getByText('Vintage Tee'));
    expect(mockNavigate).toHaveBeenCalledWith('/inventory/listing-1');
  });
});
