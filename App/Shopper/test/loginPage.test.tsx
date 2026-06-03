import {it} from 'vitest'
import {render} from '@testing-library/react'

import Page from '../src/app/login/page'

it('renders', async () => {
  render(await Page({searchParams: Promise.resolve({})}))
})
