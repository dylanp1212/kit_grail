import type {MyListing, NewListing} from '../../src/api/listings';
import type {SessionUser} from '../../src/auth';

export const fakeUser: SessionUser = {
  id: 'seller-1',
  email: 'test@example.com',
  name: 'Test',
  role: 'seller',
};

export const sampleListing: MyListing = {
  id: 'listing-1',
  seller: 'mocked-seller-id',
  title: 'Vintage Tee',
  description: 'A classic',
  size: 'medium',
  colors: ['red', 'white'],
  listed: '2026-04-01T07:30:00+00:00',
  price: 25,
  image: 'https://example.com/tee.jpg',
  quantity: 1,
};

export const sampleEditListing: MyListing = {
  id: 'listing-1',
  seller: 'mocked-seller-id',
  title: 'Soccer Jersey Kit',
  description: 'Brand new',
  size: 'medium',
  colors: ['red', 'white'],
  listed: '2026-04-01T07:30:00+00:00',
  price: 25,
  image: 'https://example.com/tee.jpg',
  quantity: 1,
};

export const sampleNewListing: NewListing = {
  seller: 'mocked-seller-id',
  title: 'New Vintage Tee',
  description: 'A new classic',
  size: 'medium',
  colors: ['blue', 'white'],
  price: 25,
  image: 'https://example.com/newtee.jpg',
  quantity: 1,
};
