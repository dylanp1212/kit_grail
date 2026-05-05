export type Size = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'

export interface MyListings {
  id: string,
  title: string,
  description: string,
  size: Size,
  colors: string[],
  listed: string,
  price: number,
  image: string
}

export interface ListingRow {
  id: string,
  seller: string,
  data: {
    title: string,
    description: string,
    size: Size,
    colors: string[],
    listed: string,
    price: number,
    image: string
  }
}