import {setupServer} from 'msw/node';
import {http, HttpResponse} from 'msw';

const LISTING_MS = 'http://localhost:3011/api/v0/kit-listing';

export const fakeListing = {
  id: 'fake-listing-id',
  seller: 'fake-seller-id',
  title: 'Fake Shirt',
  description: 'Fake Description',
  size: 'small',
  colors: ['red', 'blue'],
  listed: '2024-01-01T00:00:00+00:00',
  price: 29.99,
  image: 'http://fake.com/tee.jpg',
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

  http.post(LISTING_MS, async ({request}) => {
    const body = await request.json() as Record<string, unknown>;
    const created = {...fakeListing, ...body, id: 'new-listing-id'};
    return HttpResponse.json(created, {status: 201});
  }),
);
