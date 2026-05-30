import {it, expect, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Sort} from '../src/app/listings/sort'
import type {KitListing} from '../src/kit_listing'

const listings: KitListing[] = [
  {id: '1', seller: 's1', title: 'Zebra Kit', description: '', size: 'medium', colors: [], listed: new Date(), price: 30},
  {id: '2', seller: 's2', title: 'Alpha Kit', description: '', size: 'small',  colors: [], listed: new Date(), price: 10},
  {id: '3', seller: 's3', title: 'Mango Kit', description: '', size: 'large',  colors: [], listed: new Date(), price: 20},
]

it('renders sort button', () => {
  render(<Sort listings={listings} onSort={vi.fn()} />)
  expect(screen.getByRole('button', {name: /sort/i})).toBeDefined()
})

it('shows all sort options when button is clicked', async () => {
  render(<Sort listings={listings} onSort={vi.fn()} />)
  await userEvent.click(screen.getByRole('button', {name: /sort/i}))
  expect(screen.getByText('Price: Low to High')).toBeDefined()
  expect(screen.getByText('Price: High to Low')).toBeDefined()
  expect(screen.getByText('Name: A to Z')).toBeDefined()
  expect(screen.getByText('Name: Z to A')).toBeDefined()
})

it('sorts price low to high', async () => {
  const onSort = vi.fn()
  render(<Sort listings={listings} onSort={onSort} />)
  await userEvent.click(screen.getByRole('button', {name: /sort/i}))
  await userEvent.click(screen.getByText('Price: Low to High'))
  
  expect(onSort).toHaveBeenCalledWith([listings[1], listings[2], listings[0]])
})

it('sorts price high to low', async () => {
  const onSort = vi.fn()
  render(<Sort listings={listings} onSort={onSort} />)
  await userEvent.click(screen.getByRole('button', {name: /sort/i}))
  await userEvent.click(screen.getByText('Price: High to Low'))
  expect(onSort).toHaveBeenCalledWith([listings[0], listings[2], listings[1]])
})

it('sorts alphabetically A to Z', async () => {
  const onSort = vi.fn()
  render(<Sort listings={listings} onSort={onSort} />)
  await userEvent.click(screen.getByRole('button', {name: /sort/i}))
  await userEvent.click(screen.getByText('Name: A to Z'))
  expect(onSort).toHaveBeenCalledWith([listings[1], listings[2], listings[0]])
})

it('sorts alphabetically Z to A', async () => {
  const onSort = vi.fn()
  render(<Sort listings={listings} onSort={onSort} />)
  await userEvent.click(screen.getByRole('button', {name: /sort/i}))
  await userEvent.click(screen.getByText('Name: Z to A'))
  expect(onSort).toHaveBeenCalledWith([listings[0], listings[2], listings[1]])
})

it('closes menu without sorting when dismissed', async () => {
  const onSort = vi.fn()
  render(<Sort listings={listings} onSort={onSort} />)
  await userEvent.click(screen.getByRole('button', {name: /sort/i}))
  await userEvent.keyboard('{Escape}')
  expect(onSort).not.toHaveBeenCalled()
})
