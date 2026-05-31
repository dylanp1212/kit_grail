// /** @format uuid */
// export type UUID = string

export type Size = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'

// export interface KitListing {
//   id: string
//   seller: string
//   title: string
//   description: string
//   size: Size
//   colors: string[]
//   listed: Date
//   price: number
//   image?: string
// }

// export interface NewKitListing extends Omit<KitListing, 'id' | 'listed'> {}
export interface NewKitListing {
  seller: string
  title: string
  description: string
  size: Size
  colors: string[]
  price: number
  image?: string
}

export interface KitListing extends NewKitListing{
  id: string
  listed: Date
}

export interface KitListingPatch {
  title?: string
  description?: string
  size?: Size
  colors?: string[]
  price?: number
  image?: string
}

export interface Options {
  sizes?: Size[]
  colors?: string[]
}