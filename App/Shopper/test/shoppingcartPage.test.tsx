import { it } from 'vitest'
import { render } from '@testing-library/react'

import View from '../src/app/shoppingcart/View'
import page from '../src/app/shoppingcart/page'

it('View page renders', async () => {
  render(await View())
})

it('page renders', async() => {
  render(page())
})