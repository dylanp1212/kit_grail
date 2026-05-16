import { Size } from '../kit_listing'

export interface NewSellerListing {
  title: string
  description: string
  size: Size
  colors: string[]
  price: number
  image?: string
}

export interface ListingPatch {
  title?: string
  description?: string
  size?: Size
  colors?: string[]
  price?: number
  image?: string
}
