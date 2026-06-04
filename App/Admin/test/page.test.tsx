import {it} from 'vitest'
import {render} from '@testing-library/react'

import Home from '../src/app/page'

it('renders home page', async () => {
  render(<Home />)
})