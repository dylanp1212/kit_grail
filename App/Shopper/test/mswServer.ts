import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const WISHLIST_MS = 'http://localhost:3012/api/v0/wishlist'
const LISTING_MS = 'http://localhost:3011/api/v0/kit-listing'
const CHECKOUT_MS = 'http://localhost:3014/api/v0/checkout'

// Sorted by listed DESC to match DB ordering
const seedListings = [
  {
    id: 'ad3852b2-2e1b-40e8-9400-668f6cfd2fe3',
    title: '2019 USA Women World Cup Jersey Morgan',
    description: "USA Women's National Team 2019 World Cup home jersey\nAlex Morgan number 13 on back\nSize small\nWhite with red and blue details, Nike Dri-FIT",
    size: 'small',
    price: 150,
    colors: ['white', 'red', 'blue'],
    listed: '2026-04-01T07:30:00+00:00',
    image: 'http://localhost:3000/blankJersey.jpg',
  },
  {
    id: 'b94d22a4-da78-40cc-8dca-3144ae30e962',
    title: '1994 AC Milan Home Jersey Maldini',
    description: "AC Milan 1993/94 Serie A jersey\nMaldini number 3, match worn condition\nSize medium\nClassic Lotto, Mediolanum sponsor era",
    size: 'medium',
    price: 200,
    colors: ['red', 'black'],
    listed: '2026-03-19T10:10:00+00:00',
  },
  {
    id: '8942027f-523a-4983-843b-0f12370aa1ea',
    title: 'Random Jersey',
    description: "Some random jersey I found.\nI didnt even wash it",
    size: 'small',
    price: 20,
    colors: ['red', 'black'],
    listed: '2026-03-16T16:04:00+00:00',
  },
  {
    id: '5e25b4f0-2ef4-4ec0-8ae0-e97ca701eb74',
    title: '2014 Argentina Messi Jersey',
    description: "Messi Jersey\n2014 Argentina home jersey\nSize large\nBlue and white",
    size: 'large',
    price: 300,
    colors: ['blue', 'white'],
    listed: '2026-03-15T06:34:00+00:00',
  },
  {
    id: 'dc77d159-4aea-4514-b208-8c3eea4865f4',
    title: '2016 Real Madrid Third Jersey',
    description: "Real Madrid 2015/16 Champions League winner third kit\nAll purple with gold trim\nSize medium\nUnsponsored player issue",
    size: 'medium',
    price: 75,
    colors: ['purple', 'gold'],
    listed: '2026-03-05T12:20:00+00:00',
  },
  {
    id: '45a5e8da-9ef0-4301-b021-9f9318877a91',
    title: '2010 Netherlands World Cup Jersey',
    description: "Netherlands 2010 World Cup home jersey\nFinalists in South Africa, orange with black trim\nSize XL\nUnprinted, no name or number",
    size: 'xlarge',
    price: 97,
    colors: ['orange', 'black', 'white'],
    listed: '2026-02-28T16:00:00+00:00',
  },
  {
    id: '96939086-b537-4032-b547-53d7c467a77d',
    title: '2008 Manchester United Home Jersey Ronaldo',
    description: "Manchester United 2007/08 Champions League season jersey\nRonaldo number 7 on back\nSize large\nAIG sponsor, red with white collar",
    size: 'large',
    price: 164,
    colors: ['red', 'white', 'black'],
    listed: '2026-02-14T08:45:00+00:00',
  },
  {
    id: 'b685a347-fe92-4e43-a551-0bbbaeafad6b',
    title: '2012 Barcelona Home Jersey Iniesta',
    description: "FC Barcelona 2011/12 home jersey\nIniesta name and number 8 on back\nSize small\nBlaugrana stripes, Qatar Foundation sponsor",
    size: 'small',
    price: 123,
    colors: ['red', 'navy'],
    listed: '2026-02-03T11:30:00+00:00',
  },
  {
    id: 'd43ab28f-1fbf-4b03-87b1-7a1ede5ce45d',
    title: '1998 Brazil Away Jersey',
    description: "Brazil 1998 World Cup away jersey\nRare blue colorway from the Paris final\nSize large\nNike tick on chest",
    size: 'large',
    price: 275,
    colors: ['blue', 'white'],
    listed: '2026-01-22T14:15:00+00:00',
  },
  {
    id: '4d40647d-6691-4b8f-bec4-b93831e28e17',
    title: '2006 Italy Home Jersey',
    description: "Italy 2006 World Cup home jersey\nWorn during their championship-winning campaign\nSize medium\nNavy blue with gold Adidas stripes",
    size: 'medium',
    price: 134,
    colors: ['navy', 'white', 'gold'],
    listed: '2026-01-10T09:00:00+00:00',
  },
]

const seedWishlistItems = [
  {
    id: 'ad3852b2-2e1b-40e8-9400-668f6cfd2fe3',
    title: '2019 USA Women World Cup Jersey Morgan',
    description: "USA Women's National Team 2019 World Cup home jersey\nAlex Morgan number 13 on back\nSize small\nWhite with red and blue details, Nike Dri-FIT",
    size: 'small',
    price: 150,
    colors: ['white', 'red', 'blue'],
  },
  {
    id: 'b685a347-fe92-4e43-a551-0bbbaeafad6b',
    title: '2012 Barcelona Home Jersey Iniesta',
    description: "FC Barcelona 2011/12 home jersey\nIniesta name and number 8 on back\nSize small\nBlaugrana stripes, Qatar Foundation sponsor",
    size: 'small',
    price: 123,
    colors: ['red', 'navy'],
  },
  {
    id: '5e25b4f0-2ef4-4ec0-8ae0-e97ca701eb74',
    title: '2014 Argentina Messi Jersey',
    description: "Messi Jersey\n2014 Argentina home jersey\nSize large\nBlue and white",
    size: 'large',
    price: 300,
    colors: ['blue', 'white'],
  },
]

const listingLookup: Record<string, typeof seedListings[0]> = Object.fromEntries(
  seedListings.map(l => [l.id, l])
)

let wishlistItems = [...seedWishlistItems]
const cartItems: Record<string, string[]> = {}

export function resetWishlist() {
  wishlistItems = [...seedWishlistItems]
}

export function resetCart() {
  for (const key of Object.keys(cartItems)) delete cartItems[key]
}

export const server = setupServer(
  // CheckoutMS handlers
  http.get(`${CHECKOUT_MS}/orders/by-shopper`, () => {
    return HttpResponse.json([])
  }),

  // Kit_ListingMS handlers
  http.get(`${LISTING_MS}/:id`, ({ params }) => {
    const listing = listingLookup[params.id as string]
    if (!listing) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(listing)
  }),

  http.get(LISTING_MS, ({ request }) => {
    const search = new URL(request.url).searchParams.get('search')?.toLowerCase()
    const listings = search
      ? seedListings.filter(
          l =>
            l.title.toLowerCase().includes(search) ||
            l.description.toLowerCase().includes(search)
        )
      : seedListings
    return HttpResponse.json(listings)
  }),



  // translated wishlist handlers to GraphQL

http.post('http://localhost:3012/graphql', async ({ request }) => {
  const body = await request.json() as { query: string, variables: Record<string, string> }
  const { query, variables } = body

  if (query.includes('getAllWishlistItems')) {
    const search = variables.search?.toLowerCase()
    const items = search
      ? wishlistItems.filter(i =>
          i.title.toLowerCase().includes(search) ||
          i.description.toLowerCase().includes(search)
        )
      : wishlistItems
    return HttpResponse.json({ data: { getAllWishlistItems: items } })
  }

  if (query.includes('checkInWishlist')) {
    const found = wishlistItems.some(i => i.id === variables.listingid)
    return HttpResponse.json({ data: { checkInWishlist: found } })
  }

  if (query.includes('addToWishlist')) {
    const { listingid } = variables
    if (wishlistItems.find(i => i.id === listingid)) {
      return HttpResponse.json({ errors: [{ message: 'Already in wishlist' }] })
    }
    const listing = listingLookup[listingid]
    if (!listing) return HttpResponse.json({ errors: [{ message: 'Not found' }] })
    const newItem = { ...listing, added: new Date().toISOString() }
    wishlistItems.push(newItem)
    return HttpResponse.json({ data: { addToWishlist: newItem } })
  }

  if (query.includes('removeFromWishlist')) {
    const { listingid } = variables
    wishlistItems = wishlistItems.filter(i => i.id !== listingid)
    return HttpResponse.json({ data: { removeFromWishlist: listingid } })
  }
}),

  http.post('http://localhost:3015/graphql', async ({ request }) => {
    const body = await request.json() as { query: string, variables: Record<string, string> }
    const { query, variables } = body

    if (query.includes('getAllCartItems')) {
      const ids = cartItems[variables.userid] ?? []
      const items = ids.map(id => listingLookup[id]).filter(Boolean)
      return HttpResponse.json({ data: { getAllCartItems: items } })
    }

    if (query.includes('addToCart')) {
      const { userid, listingid } = variables
      if (!cartItems[userid]) cartItems[userid] = []
      if (!cartItems[userid].includes(listingid)) cartItems[userid].push(listingid)
      return HttpResponse.json({ data: { addToCart: listingid } })
    }

    if (query.includes('removeFromCart')) {
      const { userid, listingid } = variables
      cartItems[userid] = (cartItems[userid] ?? []).filter(id => id !== listingid)
      return HttpResponse.json({ data: { removeFromCart: listingid } })
    }

    if (query.includes('clearCart')) {
      const { userid } = variables
      cartItems[userid] = []
      return HttpResponse.json({ data: { clearCart: true } })
    }

    if (query.includes('checkInCart')) {
      const { userid, listingid } = variables
      const found = (cartItems[userid] ?? []).includes(listingid)
      return HttpResponse.json({ data: { checkInCart: found } })
    }

    if (query.includes('createGuestShopper')) {
      return HttpResponse.json({ data: { createGuestShopper: crypto.randomUUID() } })
    }

    if (query.includes('mergeCarts')) {
      const { guestId, userId } = variables
      const guestCart = cartItems[guestId] ?? []
      const userCart = cartItems[userId] ?? []
      cartItems[userId] = [...new Set([...userCart, ...guestCart])]
      delete cartItems[guestId]
      return HttpResponse.json({ data: { mergeCarts: true } })
    }
  }),
)

/*
  // WishlistMS handlers
  http.get(`${WISHLIST_MS}/:userid/:listingid`, ({ params }) => {
    const found = wishlistItems.some(i => i.id === params.listingid)
    return HttpResponse.json(found)
  }),

  http.get(`${WISHLIST_MS}/:userid`, ({ request }) => {
    const search = new URL(request.url).searchParams.get('search')?.toLowerCase()
    const items = search
      ? wishlistItems.filter(
          i =>
            i.title.toLowerCase().includes(search) ||
            i.description.toLowerCase().includes(search)
        )
      : wishlistItems
    return HttpResponse.json(items)
  }),

  http.post(`${WISHLIST_MS}/:userid/:listingid`, ({ params }) => {
    const id = params.listingid as string
    if (wishlistItems.find(i => i.id === id)) {
      return new HttpResponse(null, { status: 409 })
    }
    const listing = listingLookup[id]
    const newItem = { id, title: listing.title, description: listing.description,
      size: listing.size, price: listing.price, colors: listing.colors,
      added: new Date().toISOString() }
    wishlistItems.push(newItem)
    return HttpResponse.json(newItem, { status: 201 })
  }),

  http.delete(`${WISHLIST_MS}/:userid/:listingid`, ({ params }) => {
    const id = params.listingid as string
    wishlistItems = wishlistItems.filter(i => i.id !== id)
    return HttpResponse.json(id)
  }),
)
*/