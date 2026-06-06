import {it} from 'vitest'
import {render} from '@testing-library/react'

import Page from '../src/app/seller-suspended/page'

it('renders seller suspended page', async () => {
  render(<Page />)
})
