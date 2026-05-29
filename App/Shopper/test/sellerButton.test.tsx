import {vi, it, expect, beforeEach} from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'
import SellerButton from '../src/app/profile/SellerButton'

const assignSpy = vi.fn()

beforeEach(() => {
  vi.stubGlobal('location', {assign: assignSpy})
})

it('renders go to seller app button', () => {
  render(<SellerButton />)
  expect(screen.getByText('Go to Seller App')).not.toBeNull()
})

it('navigates to seller app on click', () => {
  render(<SellerButton />)
  fireEvent.click(screen.getByText('Go to Seller App'))
  expect(assignSpy).toHaveBeenCalledWith('https://kitgrail.com/sell/')
})
