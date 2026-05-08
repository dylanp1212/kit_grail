/** @format uuid */
export type UUID = string

export type Size = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'

export interface KitListing {
  id: string
  seller: string
  title: string
  description: string
  size: Size
  colors: string[]
  listed: Date
  price: number
  image?: string
}