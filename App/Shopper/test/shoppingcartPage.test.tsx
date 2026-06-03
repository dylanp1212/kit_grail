import { it } from 'vitest'
import { render } from '@testing-library/react'

import View from '../src/app/shoppingcart/View'

it('renders', async () => {
  render(await View())
})