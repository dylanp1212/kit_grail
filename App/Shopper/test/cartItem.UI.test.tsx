import {it, expect, vi} from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'
import CartItem from '../src/app/shoppingcart/CartItem'
import {mockItems} from '../vitest.setup'
import type {CartItem as CartItemType} from '../src/shoppingcart'
import {routerSpy} from './mockRouter'

it('clicking on listing routes to detail page', async () => {
  render(<CartItem item={mockItems[0] as unknown as CartItemType} onRemove={vi.fn()} />)
  const target = await screen.findByText(mockItems[0].title)
  fireEvent.click(target);
  await vi.waitFor(() => {
    expect(routerSpy).toHaveBeenCalledWith(`/viewlisting?id=${mockItems[0].id}`)
  })
})
