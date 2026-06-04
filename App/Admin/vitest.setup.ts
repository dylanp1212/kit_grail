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

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue({value: 'test-token'}),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: vi.fn().mockReturnValue('/'),
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams('')),
  redirect: vi.fn(),
}))
