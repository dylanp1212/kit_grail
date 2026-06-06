import {it, describe, vi, beforeEach, expect} from 'vitest';
import {render, screen} from '@testing-library/react';

import {DashboardCard} from '../../src/components/DashboardCard';
import {useOrders} from '../../src/hooks/useOrders';
import {useMyListings} from '../../src/hooks/useMyListings';

vi.mock('../../src/hooks/useOrders', () => ({
  useOrders: vi.fn(),
}));

vi.mock('../../src/hooks/useMyListings', () => ({
  useMyListings: vi.fn(),
}));

const mockedUseOrders = vi.mocked(useOrders);
const mockedUseMyListings = vi.mocked(useMyListings);

beforeEach(() => {
  mockedUseOrders.mockReturnValue({loading: false, error: null, orders: []});
  mockedUseMyListings.mockReturnValue({
    loading: false, error: null, listings: [],
  });
});

describe('DashboardCard', () => {
  it('Render DashboardCard', () => {
    render(<DashboardCard />);
  });

  it('Total price calculated', () => {
    mockedUseOrders.mockReturnValue({
      loading: false,
      error: null,
      orders: [
        {
          id: '1',
          shopper: 'shopper1',
          status: 'pending',
          paid_at: '2026-01-01',
          items: [
            {id: 'i1', kit_listing: 'k1', title: 'Item A', price: 10},
            {id: 'i2', kit_listing: 'k2', title: 'Item B', price: 5},
          ],
        },
        {
          id: '2',
          shopper: 'shopper1',
          status: 'pending',
          paid_at: '2026-01-01',
          items: [
            {id: 'i3', kit_listing: 'k3', title: 'Item C', price: 20},
          ],
        },
      ],
    });
    render(<DashboardCard />);
    expect(screen.getByText('$35.00')).toBeTruthy();
  });
});
