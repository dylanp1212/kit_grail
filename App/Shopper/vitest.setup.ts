import { cleanup } from '@testing-library/react'
import {
  beforeAll,
  beforeEach, afterEach, afterAll, vi } from 'vitest'

import {mockRouter} from './test/mockRouter';
import 'dotenv/config'
import { Pool } from 'pg'
import { readFileSync } from 'fs'
import { server, resetWishlist, resetCart } from './test/mswServer'

beforeAll(async () => {
  server.listen()
  const pool = new Pool({
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: 5432,
    database: 'test',
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  })
  await pool.query('CREATE EXTENSION IF NOT EXISTS pgcrypto')
  const schema = readFileSync('./sql/schema.sql', 'utf-8')
  await pool.query(schema)
  const data = readFileSync('./sql/data.sql', 'utf-8')
  await pool.query(data)
  await pool.end()
})

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  resetWishlist()
  resetCart()
  server.resetHandlers()
  cleanup()
})

afterAll(() => {
  server.close()
})
export const sallyid = 'e86405c1-545b-4bef-912c-a9b01ee6d18f'
export const milan94id = 'b94d22a4-da78-40cc-8dca-3144ae30e962'
export const uswntid = 'ad3852b2-2e1b-40e8-9400-668f6cfd2fe3'
export const brazilid = 'd43ab28f-1fbf-4b03-87b1-7a1ede5ce45d'

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
    listed: new Date('2025-03-01T20:02:00+00:00'),
  },
  {
    id: '1ec5b401-5a82-4dbe-8745-feb18a322be4',
    size: 'small',
    title: 'Brazil 1996 Away Jersey Shirt Football Soccer Small Mens',
    colors: [ 'yellow', 'green' ],
    description: 'Messi Jersey\\n2014 Argentina home jersey\\nSize large\\nBlue and white',
    price: 75,
    listed: new Date('2026-03-01T20:02:00+00:00'),
    image: 'https://i.ebayimg.com/images/g/CZ8AAOSwzetlssmP/s-l400.jpg',
  },
  {
    id: 'c8f95e3d-b96c-451c-bf61-7b67976b0ffd',
    size: 'xsmall',
    title: 'Old Jersey',
    colors: [ 'yellow', 'purple' ],
    description: 'some old jersey',
    price: 15,
    listed: new Date('2020-03-01T20:02:00+00:00'),
    image: 'https://i.ebayimg.com/images/g/CZ8AAOSwzetlssmP/s-l400.jpg',
  },
];

export const mockItems = [
  {...mockListings[0], added: new Date()},
  {...mockListings[1], added: new Date('2025-03-02T20:02:00+00:00')},
  {...mockListings[2], added: new Date('2026-03-02T20:02:00+00:00')},
  {...mockListings[3], added: new Date('2021-03-02T20:02:00+00:00')},
]

vi.mock('./src/kit_listing/service', () => ({
  ListingService: class {
    getAllKitListings = vi.fn().mockResolvedValue(mockListings)
    getKitListingById = vi.fn().mockResolvedValue(mockListings[0])
  },
}));

vi.mock('./src/historian/actions', () => ({
  getListingHistory: vi.fn().mockResolvedValue(null),
}));

vi.mock('./src/wishlist/service', () => ({
  WishlistService: class {
    getAllWishlistItems = vi.fn().mockResolvedValue(mockItems)
    addToWishlist = vi.fn().mockResolvedValue(mockItems[0])
    removeFromWishlist = vi.fn().mockResolvedValue(mockItems[0].id)
    checkInWishlist = vi.fn().mockResolvedValue(false)
  },
}));

vi.mock('./src/shoppingcart/service', () => ({
  CartService: class {
    getAllCartItems = vi.fn().mockResolvedValue(mockItems)
    addToCart = vi.fn().mockResolvedValue(mockItems[0].id)
    removeFromCart = vi.fn().mockResolvedValue(mockItems[0].id)
    checkInCart = vi.fn().mockResolvedValue(false)
    createGuestShopper = vi.fn().mockResolvedValue('guest-test-id')
    mergeCarts = vi.fn().mockResolvedValue(true)
    clearCart = vi.fn().mockResolvedValue(true)
  },
}));

vi.mock('./src/checkout/service', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./src/checkout/service')>()),
  createCheckoutSession: vi.fn().mockResolvedValue('https://checkout.stripe.com/pay/test123'),
}));

vi.mock('./src/auth/actions', () => ({
  getSessionUser: vi.fn().mockResolvedValue({
    id: sallyid,
    email: 'sally@gmail.com',
    name: 'Sally Shopper',
    role: 'shopper',
  }),
  signOut: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue({ value: 'guest-abc-123' }),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams('')),
  useRouter: () => mockRouter,
}));

vi.mock('next-intl/server', async () => {
  const en = (await import('./messages/en.json')).default as Record<string, Record<string, string>>
  return {
    getTranslations: vi.fn().mockImplementation(async (namespace: string) => {
      const ns = en[namespace] ?? {}
      return (key: string) => ns[key] ?? key
    }),
  }
});

vi.mock('next-intl', async () => {
  const en = (await import('./messages/en.json')).default as Record<string, Record<string, string>>
  return {
    useTranslations: vi.fn().mockImplementation((namespace: string) => {
      const ns = en[namespace] ?? {}
      return (key: string) => ns[key] ?? key
    }),
    useLocale: vi.fn().mockReturnValue('en'),
  }
});