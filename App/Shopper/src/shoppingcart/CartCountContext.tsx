'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getAllCartItems } from './actions'

interface CartCountContextType {
  count: number
  increment: () => void
  decrement: () => void
}

export const CartCountContext = createContext<CartCountContextType>({
  count: 0,
  increment: () => {},
  decrement: () => {},
})

export function CartCountProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    getAllCartItems().then(items => setCount(items.length)).catch(() => {})
  }, [])

  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => Math.max(0, c - 1))

  return (
    <CartCountContext.Provider value={{ count, increment, decrement }}>
      {children}
    </CartCountContext.Provider>
  )
}

export function useCartCount() {
  return useContext(CartCountContext)
}
