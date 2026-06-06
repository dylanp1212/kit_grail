import {it, vi, expect} from 'vitest'
import {render} from '@testing-library/react'
import {mockRouter} from './mockRouter'
import Page from '../src/app/profile/page'

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams('')),
  useRouter: () => mockRouter,
  redirect: vi.fn(),
}))

it('renders profile page', async () => {
  render(await Page())
})

it('redirects to login when not authenticated', async () => {
  const {getSessionUser} = await import('../src/auth/actions')
  const {redirect} = await import('next/navigation')
  vi.mocked(getSessionUser).mockResolvedValueOnce(undefined)
  await Page()
  expect(vi.mocked(redirect)).toHaveBeenCalledWith('/login')
})
