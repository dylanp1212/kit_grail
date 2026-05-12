'use client'
import {useState, useEffect} from 'react'
import {addToCart, checkInCart} from './actions'

export function useCart(listingid: string) {
  const [inCart, setInCart] = useState(false)
  useEffect(() => {
    const check = async (): Promise<void> => {
      setInCart(await checkInCart(listingid))
    }
    void check()
  }, [])
  const handleClick = () => {
    void addToCart(listingid)
    setInCart(true)
  }
  return {inCart, handleClick}
}
