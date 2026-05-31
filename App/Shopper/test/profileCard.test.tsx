import {vi, it, expect} from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'
import {routerSpy} from './mockRouter'
import ProfileCard from '../src/components/ProfileCard'

it('goes to profile on click profile card', async () => {
  render(<ProfileCard />)
  const card = await screen.findByLabelText('profile card')
  fireEvent.click(card)
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith('/profile')
  })
})

it('goes to login if profile card clicked when not authenticated', async () => {
  const {getSessionUser} = await import('../src/auth/actions')
  // Two overrides: ProfileCard useEffect on mount, then click handler
  vi.mocked(getSessionUser).mockResolvedValueOnce(undefined)
  vi.mocked(getSessionUser).mockResolvedValueOnce(undefined)
  render(<ProfileCard />)
  const card = await screen.findByLabelText('profile card')
  fireEvent.click(card)
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith('/login')
  })
})
