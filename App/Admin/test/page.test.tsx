import {it} from 'vitest'
import {render} from '@testing-library/react'

import Home from '../src/app/page'

it('Renders', async () => {
  render(<Home />)
})