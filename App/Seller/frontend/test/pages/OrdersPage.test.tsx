import {it, describe, beforeEach, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import '../../src/i18n';
import {OrdersPage} from '../../src/pages/OrdersPage';
import {getOrders} from '../../src/api/orders';
import {sampleOrder} from '../fixtures/orders';
import {SellerContext} from '../../src/context/SellerContext';
import {fakeUser} from '../fixtures/listings';

vi.mock('../../src/api/orders', () => ({
  getOrders: vi.fn(),
}));

const mockedGetOrders = vi.mocked(getOrders);

const renderPage = () => render(
    <MemoryRouter>
      <SellerContext.Provider value={fakeUser}>
        <OrdersPage />
      </SellerContext.Provider>
    </MemoryRouter>,
);

describe('OrdersPage', () => {
  beforeEach(() => {
    mockedGetOrders.mockReset();
    mockedGetOrders.mockResolvedValue([]);
  });

  it('renders without crashing', () => {
    renderPage();
  });

  it('shows "Orders" heading', async () => {
    renderPage();
    expect(await screen.findByText('Orders')).toBeInTheDocument();
  });

  it('shows empty state when no orders', async () => {
    renderPage();
    expect(await screen.findByText(/no orders yet/i)).toBeInTheDocument();
  });

  it('renders order item title and price', async () => {
    mockedGetOrders.mockResolvedValue([sampleOrder]);
    renderPage();
    expect(await screen.findByText('Vintage Tee')).toBeInTheDocument();
    expect((await screen.findAllByText('$25.00')).length).toBeGreaterThan(0);
  });

  it('shows shopper name and email when present', async () => {
    mockedGetOrders.mockResolvedValue([{
      ...sampleOrder,
      shopper_name: 'Sally Shopper',
      shopper_email: 'sally@example.com',
    }]);
    renderPage();
    expect(await screen.findByText('Sally Shopper')).toBeInTheDocument();
    expect(await screen.findByText('sally@example.com')).toBeInTheDocument();
  });

  it('falls back to "Unknown shopper" when name is missing', async () => {
    mockedGetOrders.mockResolvedValue([sampleOrder]);
    renderPage();
    expect(await screen.findByText(/unknown shopper/i)).toBeInTheDocument();
  });

  it('shows the status chip', async () => {
    mockedGetOrders.mockResolvedValue([sampleOrder]);
    renderPage();
    expect(await screen.findByText('Paid')).toBeInTheDocument();
  });

  it('shows "Pending" chip for pending status', async () => {
    mockedGetOrders.mockResolvedValue([{...sampleOrder, status: 'pending'}]);
    renderPage();
    expect(await screen.findByText('Pending')).toBeInTheDocument();
  });

  it('falls back to raw status for unknown status', async () => {
    mockedGetOrders.mockResolvedValue([{...sampleOrder, status: 'refunded'}]);
    renderPage();
    expect(await screen.findByText('refunded')).toBeInTheDocument();
  });

  it('renders an order total', async () => {
    mockedGetOrders.mockResolvedValue([{
      ...sampleOrder,
      items: [
        {id: 'a', kit_listing: 'l1', title: 'A', price: 10},
        {id: 'b', kit_listing: 'l2', title: 'B', price: 15.5},
      ],
    }]);
    renderPage();
    expect(await screen.findByText('Total')).toBeInTheDocument();
    expect(await screen.findByText('$25.50')).toBeInTheDocument();
  });

  it('treats a null item price as 0 in the order total', async () => {
    mockedGetOrders.mockResolvedValue([{
      ...sampleOrder,
      items: [
        {id: 'a', kit_listing: 'l1', title: 'A',
          price: null as unknown as number},
        {id: 'b', kit_listing: 'l2', title: 'B', price: 10},
      ],
    }]);
    renderPage();
    expect(await screen.findByText('$0.00')).toBeInTheDocument();
  });

  it('shows a truncated order id', async () => {
    mockedGetOrders.mockResolvedValue([{
      ...sampleOrder,
      id: 'abcd1234-5678-9012-3456-7890abcdef00',
    }]);
    renderPage();
    expect(await screen.findByText(/#abcd1234/)).toBeInTheDocument();
  });

  it('shows error when API fails', async () => {
    mockedGetOrders.mockRejectedValue(new Error('Failed: 500'));
    renderPage();
    expect(await screen.findByText(/Error: Failed: 500/i)).toBeInTheDocument();
  });
});
