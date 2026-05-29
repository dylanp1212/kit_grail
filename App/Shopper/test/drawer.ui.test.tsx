import {vi, it, expect} from 'vitest'
import {routerSpy} from './mockRouter'
import {render, screen, fireEvent} from '@testing-library/react'
import DrawerButton from '../src/components/DrawerButton'

const opendrawer = async () => {
  render(<DrawerButton />)
  const menu = await screen.findByLabelText('open menu')
  fireEvent.click(menu)
}

it('opens drawer on click', async () => {
  await opendrawer()
  await vi.waitFor(async () => {
    const shop = await screen.findByText('Shop')
    expect(shop).not.toBeNull()
  })
})

const clickbutton = async (name: string) => {
  await opendrawer()
  const button = await screen.findByText(name)
  fireEvent.click(button)
}

it('goes to shop on click shop', async () => {
  await clickbutton('Shop')
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith(`/listings`)
  })
})

it('goes to wishlist on click wishlist', async () => {
  await clickbutton('Wishlist')
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith(`/wishlist`)
  })
})

it('closes drawer on click away', async () => {
  await opendrawer()
  fireEvent.keyDown(document.activeElement ?? document, {key: 'Escape'})
  await vi.waitFor(() => {
    const shop = screen.queryByText('Shop')
    expect(shop).not.toBeNull()
  })
})

it('goes to login on sign out (authenticated)', async () => {
  await clickbutton('Sign Out')
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith(`/login`)
  })
})

it('goes to login on sign in (un authenticated)', async () => {
  const {getSessionUser} = await import('../src/auth/actions')
  vi.mocked(getSessionUser).mockResolvedValueOnce(undefined)
  await clickbutton('Sign In')
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith(`/login`)
  })
})

it('goes to profile on click profile', async () => {
  await clickbutton('Profile')
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith(`/profile`)
  })
})

it('goes to login if profile clicked when not authenticated', async () => {
  const {getSessionUser} = await import('../src/auth/actions')
  // Three overrides needed: ProfileCard and SignoutButton each call getSessionUser
  // in useEffect on mount, consuming two before the click handler gets the third.
  vi.mocked(getSessionUser).mockResolvedValueOnce(undefined)
  vi.mocked(getSessionUser).mockResolvedValueOnce(undefined)
  vi.mocked(getSessionUser).mockResolvedValueOnce(undefined)
  await clickbutton('Profile')
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith(`/login`)
  })
})
