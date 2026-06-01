export type Size = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'

export interface MyListings {
  id: string,
  seller: string,
  title: string,
  description: string,
  size: Size,
  colors: string[],
  listed: Date,
  price: number,
  image?: string
  quantity: number,
}

export interface NewListing {
  seller: string,
  title: string,
  description: string,
  size: Size,
  colors: string[],
  price: number,
  image?: string,
  quantity: number
}

export interface ListingRow {
  id: string,
  seller: string,
  data: {
    title: string,
    description: string,
    size: Size,
    colors: string[],
    listed: Date,
    price: number,
    image?: string,
    quantity: number,
  }
}

export interface EditedListing {
  title?: string
  description?: string
  size?: Size
  colors?: string[]
  price?: number
  image?: string
  quantity: number
}
