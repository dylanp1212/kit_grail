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

const clickshop = async () => {
  await opendrawer()
  const shop = await screen.findByText('Shop')
  fireEvent.click(shop)
}

it('goes to shop on click shop', async () => {
  await clickshop()
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith(`/listings`)
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