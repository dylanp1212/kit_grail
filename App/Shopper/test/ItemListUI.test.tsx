import { it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ItemList from '../src/app/listings/ItemList'


it('Renders ItemList', async () => {
  render(<ItemList />)
})



