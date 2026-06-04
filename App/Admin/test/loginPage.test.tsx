import {it, vi, expect} from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'

import Page from '../src/app/login/page'

vi.mock('../src/auth/actions', () => ({
  loginAdmin: vi.fn(),
}))

import * as actions from '../src/auth/actions'

function submitForm(email = 'admin@example.com', password = 'password') {
  render(<Page />)
  fireEvent.change(screen.getByLabelText(/email/i), {target: {value: email}})
  fireEvent.change(screen.getByLabelText(/password/i), {target: {value: password}})
  fireEvent.click(screen.getByRole('button', {name: /sign in/i}))
}

it('renders login page', async () => {
  render(<Page />)
})

it('successful login shows no error', async () => {
  vi.mocked(actions.loginAdmin).mockResolvedValueOnce(undefined)
  submitForm()
  await vi.waitFor(() => {
    expect(screen.queryByRole('alert')).toBeNull()
  })
})

it('failed login shows error message', async () => {
  vi.mocked(actions.loginAdmin).mockResolvedValueOnce('Invalid email or password')
  submitForm('admin@example.com', 'wrongpassword')
  await vi.waitFor(() => {
    expect(screen.getByText('Invalid email or password')).not.toBeNull()
  })
})

it('closing the error popup dismisses it', async () => {
  vi.mocked(actions.loginAdmin).mockResolvedValueOnce('Invalid email or password')
  submitForm('admin@example.com', 'wrongpassword')
  await vi.waitFor(() => {
    expect(screen.getByText('Invalid email or password')).not.toBeNull()
  })
  fireEvent.click(screen.getByRole('button', {name: /close/i}))
  await vi.waitFor(() => {
    expect(screen.queryByText('Invalid email or password')).toBeNull()
  })
})

it('clicking away from the error popup dismisses it', async () => {
  vi.mocked(actions.loginAdmin).mockResolvedValueOnce('Invalid email or password')
  submitForm('admin@example.com', 'wrongpassword')
  await vi.waitFor(() => {
    expect(screen.getByText('Invalid email or password')).not.toBeNull()
  })
  fireEvent.click(document.body)
  await vi.waitFor(() => {
    expect(screen.queryByText('Invalid email or password')).toBeNull()
  })
})
