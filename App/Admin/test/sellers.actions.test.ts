import {it, expect, vi} from 'vitest'
import {getAllSellers, setSuspended} from '../src/sellers/actions'
import {seedSellers} from './mswServer'
import {revalidatePath} from 'next/cache'

it('getAllSellers returns sellers from service', async () => {
  const sellers = await getAllSellers()
  expect(sellers).toEqual(seedSellers)
})

it('setSuspended calls service and revalidates /sellers', async () => {
  await setSuspended('seller-1', true)
  expect(revalidatePath).toHaveBeenCalledWith('/sellers')
})
