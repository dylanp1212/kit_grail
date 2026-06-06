import { it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import ChangeProfile from '../src/app/profile/ChangeProfile'
import { server } from './mswServer'

it('renders url input and update button', () => {
  render(<ChangeProfile />)
  expect(screen.getByPlaceholderText('Paste image URL here')).not.toBeNull()
  expect(screen.getByRole('button', { name: /update picture/i })).not.toBeNull()
})

it('shows default person icon when no url is set', () => {
  render(<ChangeProfile />)
  expect(screen.getByTestId('PersonIcon')).not.toBeNull()
})


it('updates avatar src after submitting a url', async () => {
  render(<ChangeProfile />)
  await userEvent.type(screen.getByPlaceholderText('Paste image URL here'), 'https://picsum.photos/200')
  await userEvent.click(screen.getByRole('button', { name: /update picture/i }))
  const img = screen.getByRole('img') as HTMLImageElement
  expect(img.src).toBe('https://picsum.photos/200')
})

it('does not update avatar when update fails', async () => {
  server.use(
    http.get('http://localhost:3010/api/v0/profile/picture', () =>
      HttpResponse.json({}), { once: true }
    ),
    http.put('http://localhost:3010/api/v0/profile/picture', () =>
      new HttpResponse(null, { status: 500 }), { once: true }
    )
  )
  render(<ChangeProfile />)
  await userEvent.type(screen.getByPlaceholderText('Paste image URL here'), 'https://picsum.photos/200')
  await userEvent.click(screen.getByRole('button', { name: /update picture/i }))
  expect(screen.getByTestId('PersonIcon')).not.toBeNull()
})

it('replaces avatar src when a new url is submitted', async () => {
  render(<ChangeProfile />)
  const input = screen.getByPlaceholderText('Paste image URL here')
  await userEvent.type(input, 'https://picsum.photos/200')
  await userEvent.click(screen.getByRole('button', { name: /update picture/i }))
  await userEvent.clear(input)
  await userEvent.type(input, 'https://picsum.photos/300')
  await userEvent.click(screen.getByRole('button', { name: /update picture/i }))
  const img = screen.getByRole('img') as HTMLImageElement
  expect(img.src).toBe('https://picsum.photos/300')
})
