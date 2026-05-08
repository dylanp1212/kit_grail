import type {MyListing} from '../../src/api/listings';

export const sampleListing: MyListing = {
  id: 'listing-1',
  title: 'Vintage Tee',
  description: 'A classic',
  size: 'M',
  colors: ['red', 'white'],
  listed: '2026-04-01T07:30:00+00:00',
  price: 25,
  image: 'https://example.com/tee.jpg',
};
