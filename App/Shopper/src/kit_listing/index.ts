export type Size = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'

export interface Options {
  sizes?: Size[]
  colors?: string[]
}

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
