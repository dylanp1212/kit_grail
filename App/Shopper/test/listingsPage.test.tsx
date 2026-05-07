import { it } from 'vitest'
import { render } from '@testing-library/react'

import Page from '../src/app/listings/page'

it('renders', async () => {
  render(<Page />)
})
