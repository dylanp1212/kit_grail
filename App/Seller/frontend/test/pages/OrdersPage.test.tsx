import {it, describe, beforeEach, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import {OrdersPage} from '../../src/pages/OrdersPage';
import {getOrders} from '../../src/api/orders';
import {sampleOrder} from '../fixtures/orders';
import {SellerContext} from '../../src/context/SellerContext';
import {fakeUser} from '../fixtures/listings';

vi.mock('../../src/api/orders', () => ({
  getOrders: vi.fn(),
}));

const mockedGetOrders = vi.mocked(getOrders);

describe('OrdersPage', () => {
  beforeEach(() => {
    mockedGetOrders.mockReset();
    mockedGetOrders.mockResolvedValue([]);
  });

  it('renders without crashing', () => {
    render(
        <MemoryRouter>
          <SellerContext.Provider value={fakeUser}>
            <OrdersPage />
          </SellerContext.Provider>
        </MemoryRouter>,
    );
  });

  it('shows "Orders" heading', async () => {
    render(
        <MemoryRouter>
          <SellerContext.Provider value={fakeUser}>
            <OrdersPage />
          </SellerContext.Provider>
        </MemoryRouter>,
    );
    expect(await screen.findByText('Orders')).toBeInTheDocument();
  });

  it('shows empty state when no orders', async () => {
    render(
        <MemoryRouter>
          <SellerContext.Provider value={fakeUser}>
            <OrdersPage />
          </SellerContext.Provider>
        </MemoryRouter>,
    );
    expect(await screen.findByText(/no orders yet/i)).toBeInTheDocument();
  });

  it('renders order item title and price', async () => {
    mockedGetOrders.mockResolvedValue([sampleOrder]);
    render(
        <MemoryRouter>
          <SellerContext.Provider value={fakeUser}>
            <OrdersPage />
          </SellerContext.Provider>
        </MemoryRouter>,
    );
    expect(await screen.findByText('Vintage Tee')).toBeInTheDocument();
    expect(await screen.findByText('$25.00')).toBeInTheDocument();
  });

  it('shows error when API fails', async () => {
    mockedGetOrders.mockRejectedValue(new Error('Failed: 500'));
    render(
        <MemoryRouter>
          <SellerContext.Provider value={fakeUser}>
            <OrdersPage />
          </SellerContext.Provider>
        </MemoryRouter>,
    );
    expect(await screen.findByText(/Error: Failed: 500/i)).toBeInTheDocument();
  });
});
