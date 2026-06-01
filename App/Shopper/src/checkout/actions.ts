'use server'

import { getSessionUser } from '../auth/actions'
import { getMyOrders, ShopperOrder } from './service'

export async function getMyOrdersAction(): Promise<ShopperOrder[]> {
  const user = await getSessionUser()
  if (!user) return []
  return getMyOrders(user.id)
}
