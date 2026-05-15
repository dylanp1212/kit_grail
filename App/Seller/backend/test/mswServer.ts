import {setupServer} from 'msw/node';
import {http, HttpResponse} from 'msw';

const LISTING_MS = 'http://localhost:3011/api/v0/kit-listing';

export const fakeListing = {
  id: 'fake-listing-id',
  title: 'Fake Shirt',
  description: 'Fake Description',
  size: 'small',
  colors: ['red', 'blue'],
  listed: '2024-01-01T00:00:00+00:00',
  price: 29.99,
  image: '/tee.jpg',
};

const listingLookup: Record<string, typeof fakeListing> = {
  [fakeListing.id]: fakeListing,
};

export const mswServer = setupServer(
  http.get(`${LISTING_MS}/:id`, ({params}) => {
    const listing = listingLookup[params.id as string];
    if (!listing) return new HttpResponse(null, {status: 404});
    return HttpResponse.json(listing);
  }),

  http.get(LISTING_MS, () => {
    return HttpResponse.json([fakeListing]);
  }),
);
