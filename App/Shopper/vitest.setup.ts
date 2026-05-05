import { cleanup } from '@testing-library/react'
import { beforeEach, afterEach, vi } from 'vitest'
import {mockRouter} from './test/mockRouter';
import 'dotenv/config'

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
})

export const mockListings = [
  {
    id: 'aa0fccb7-06f8-4f29-ae65-b30c2adabce8',
    size: 'large',
    title: 'Messi Argentina Home Jersey 2014',
    colors: [ 'blue', 'white' ],
    description: 'Messi Jersey\\n2014 Argentina home jersey\\nSize large\\nBlue and white',
    price: 300,
    listed: Date.now(),
    image: 'https://i.ebayimg.com/images/g/CZ8AAOSwzetlssmP/s-l400.jpg',
  },
  {
    id: 'bde7457b-d78c-4c6b-bbe2-79047fa6d4d5',
    size: 'xlarge',
    title: 'Busquets Spain Home Jersey 2010',
    colors: [ 'red', 'blue' ],
    description: 'Messi Jersey\\n2014 Argentina home jersey\\nSize large\\nBlue and white',
    price: 130,
    listed: Date.now(),
  },
  {
    id: '1ec5b401-5a82-4dbe-8745-feb18a322be4',
    size: 'small',
    title: 'Brazil 1996 Away Jersey Shirt Football Soccer Small Mens',
    colors: [ 'yellow', 'green' ],
    description: 'Messi Jersey\\n2014 Argentina home jersey\\nSize large\\nBlue and white',
    price: 75,
    listed: Date.now(),
    image: 'https://i.ebayimg.com/images/g/CZ8AAOSwzetlssmP/s-l400.jpg',
  },
];

export const mockItems = mockListings.map(listing => ({
  ...listing,
  added: new Date(),
}))

vi.mock('./src/kit_listing/service', () => ({
  ListingService: class {
    getAllKitListings = vi.fn().mockResolvedValue(mockListings)
    getKitListingById = vi.fn().mockResolvedValue(mockListings[0])
  },
}));

vi.mock('./src/wishlist/service', () => ({
  WishlistService: class {
    getAllWishlistItems = vi.fn().mockResolvedValue(mockItems)
    addToWishlist = vi.fn().mockResolvedValue(mockItems[0])
    removeFromWishlist = vi.fn().mockResolvedValue(mockItems[0].id)
    checkInWishlist = vi.fn().mockResolvedValue(false)
  },
}));

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams('')),
  useRouter: () => mockRouter,
}));