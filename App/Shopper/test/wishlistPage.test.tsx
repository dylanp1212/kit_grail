import { it } from 'vitest'
import { render } from '@testing-library/react'

import Page from '../src/app/wishlist/page'

it('renders', async () => {
  render(<Page />)
})