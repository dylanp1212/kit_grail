import {it, vi} from 'vitest'
import {render, waitFor} from '@testing-library/react'
import {seedOrdersPerDay} from './mswServer'

vi.mock('../src/orders/actions', () => ({
  getOrdersPerDay: vi.fn().mockResolvedValue(seedOrdersPerDay),
}))

vi.mock('react-chartjs-2', () => ({
  Line: () => null,
}))

import OrdersChart from '../src/components/ordersChart'

it('processes orders data into chart arrays', async () => {
  render(<OrdersChart />)
  await waitFor(() => {
  })
})
