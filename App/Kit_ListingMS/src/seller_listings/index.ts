import { Size } from '../kit_listing'

export interface NewSellerListing {
  title: string
  description: string
  size: Size
  colors: string[]
  price: number
  image?: string
  quantity: number
}

export interface ListingPatch {
  title?: string
  description?: string
  size?: Size
  colors?: string[]
  price?: number
  image?: string
  quantity?: number
}
