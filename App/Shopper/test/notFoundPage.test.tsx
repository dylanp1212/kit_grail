import { it } from 'vitest'
import { render } from '@testing-library/react'

import Page from '../src/app/not-found'

it('renders', async () => {
  render(await Page())
})
