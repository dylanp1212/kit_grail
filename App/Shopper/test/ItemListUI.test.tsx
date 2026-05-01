import { it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ItemList from '../src/app/listings/ItemList'
import { vi } from 'vitest'


it('Renders ItemList', async () => {
  render(<ItemList />)
})



