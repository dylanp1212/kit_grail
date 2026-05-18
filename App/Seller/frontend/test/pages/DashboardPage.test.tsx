import {it, describe, vi} from 'vitest';
import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import {Dashboard} from '../../src/pages/Dashboard';
import {fakeUser} from '../fixtures/listings';
import {SellerContext} from '../../src/context/SellerContext';

vi.mock('../../src/api/listings', () => ({
  getAllListings: vi.fn().mockResolvedValue([]),
}));

describe('dashboard page', () => {
  it('renders dashboard page', () => {
    render(
        <MemoryRouter>
          <SellerContext.Provider value={fakeUser}>
            <Dashboard />
          </SellerContext.Provider>
        </MemoryRouter>,
    );
  });
});
