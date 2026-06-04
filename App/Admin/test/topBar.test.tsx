import {it, vi, expect} from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'

import TopBar from '../src/components/topBar'
import {mockRouter} from './mockRouter'

vi.mock('../src/auth/actions', () => ({
  signOut: vi.fn(),
}))

import * as authActions from '../src/auth/actions'

it('renders the top bar', () => {
  render(<TopBar title='Kit Grail Admin Portal' />)
})

it('dashboard button navigates to /', () => {
  render(<TopBar title='Kit Grail Admin Portal' />)
  fireEvent.click(screen.getByRole('button', {name: /dashboard/i}))
  expect(mockRouter.push).toHaveBeenCalledWith('/')
})

it('log out button calls signOut', () => {
  vi.mocked(authActions.signOut).mockResolvedValueOnce(undefined)
  render(<TopBar title='Kit Grail Admin Portal' />)
  fireEvent.click(screen.getByRole('button', {name: /log out/i}))
  expect(authActions.signOut).toHaveBeenCalled()
})
