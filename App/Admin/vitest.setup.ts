import {beforeAll, afterEach, afterAll, vi} from 'vitest'
import {cleanup} from '@testing-library/react'
import {server} from './test/mswServer'
import {mockRouter} from './test/mockRouter'

export {mockRouter}

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  cleanup()
})

vi.mock('./src/sellers/service', () => ({
  SellerService: class {
    getAllSellers = vi.fn().mockResolvedValue([
      {id: 'seller-1', name: 'Bob Seller', email: 'bob@example.com', suspended: false},
    ])
    setSuspended = vi.fn().mockResolvedValue(undefined)
  },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: vi.fn().mockReturnValue('/'),
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams('')),
}))
