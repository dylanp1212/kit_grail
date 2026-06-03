const isTest = process.env.NODE_ENV === 'test';
if (!isTest) {
  await import('server-only');
}

import { CartItem } from '.'

const GQL_URL = 'http://localhost:3015/graphql'
const ITEM_FIELDS = `id seller title description size colors listed price image`

async function gql(query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(GQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  return res.json() as Promise<{ data: Record<string, unknown>, errors?: unknown[] }>
}

export class CartService {
  public async getAllCartItems(userid: string): Promise<CartItem[]> {
    const json = await gql(
      `query GetAll($userid: String!) {
        getAllCartItems(userid: $userid) { ${ITEM_FIELDS} }
      }`,
      { userid }
    )
    if (json.errors) throw new Error(JSON.stringify(json.errors))
    return json.data.getAllCartItems as CartItem[]
  }

  public async addToCart(listingid: string, userid: string): Promise<string> {
    const json = await gql(
      `mutation Add($userid: String!, $listingid: String!) {
        addToCart(userid: $userid, listingid: $listingid)
      }`,
      { userid, listingid }
    )
    if (json.errors) throw new Error(JSON.stringify(json.errors))
    return json.data.addToCart as string
  }

  public async removeFromCart(listingid: string, userid: string): Promise<string> {
    const json = await gql(
      `mutation Remove($userid: String!, $listingid: String!) {
        removeFromCart(userid: $userid, listingid: $listingid)
      }`,
      { userid, listingid }
    )
    if (json.errors) throw new Error(JSON.stringify(json.errors))
    return json.data.removeFromCart as string
  }

  public async checkInCart(listingid: string, userid: string): Promise<boolean> {
    const json = await gql(
      `query Check($userid: String!, $listingid: String!) {
        checkInCart(userid: $userid, listingid: $listingid)
      }`,
      { userid, listingid }
    )
    if (json.errors) return false
    return json.data.checkInCart as boolean
  }

  public async createGuestShopper(): Promise<string> {
    const json = await gql(
      `mutation {
        createGuestShopper
      }`
    )
    if (json.errors) throw new Error(JSON.stringify(json.errors))
    return json.data.createGuestShopper as string
  }

  public async clearCart(userid: string): Promise<boolean> {
    const json = await gql(
      `mutation Clear($userid: String!) {
        clearCart(userid: $userid)
      }`,
      { userid }
    )
    if (json.errors) throw new Error(JSON.stringify(json.errors))
    return json.data.clearCart as boolean
  }

  public async mergeCarts(guestId: string, userId: string): Promise<boolean> {
    const json = await gql(
      `mutation Merge($guestId: String!, $userId: String!) {
        mergeCarts(guestId: $guestId, userId: $userId)
      }`,
      { guestId, userId }
    )
    if (json.errors) throw new Error(JSON.stringify(json.errors))
    return json.data.mergeCarts as boolean
  }
}
