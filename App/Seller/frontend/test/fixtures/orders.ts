import type {SellerOrder} from '../../src/api/orders';

export const sampleOrder: SellerOrder = {
  id: 'order-1',
  shopper: 'shopper-1',
  status: 'paid',
  paid_at: '2026-05-01T10:00:00+00:00',
  items: [
    {
      id: 'item-1',
      kit_listing: 'listing-1',
      title: 'Vintage Tee',
      price: 25,
    },
  ],
};
