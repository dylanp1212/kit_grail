import {
  Query,
  Resolver,
  Mutation,
  Arg,
  Authorized,
} from "type-graphql"

import { GraphQLError } from "graphql"

import { CartItem } from "./schema"
import { CartService } from "./service"

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const validateUUID = (id: string, field: string) => {
  if (!UUID_RE.test(id)) {
    throw new GraphQLError(`Invalid ${field} format`)
  }
}

@Resolver()
export class CartResolver {
  @Authorized()
  @Query(() => [CartItem])
  async getAllCartItems(
    @Arg("userid") userid: string
  ): Promise<CartItem[]> {
    validateUUID(userid, "user ID")
    return new CartService().getAllCartItems(userid)
  }

  @Authorized()
  @Query(() => Boolean)
  async checkInCart(
    @Arg("userid") userid: string,
    @Arg("listingid") listingid: string
  ): Promise<boolean> {
    validateUUID(userid, "user ID")
    validateUUID(listingid, "listing ID")
    return new CartService().checkInCart(listingid, userid)
  }

  @Authorized()
  @Mutation(() => String)
  async addToCart(
    @Arg("userid") userid: string,
    @Arg("listingid") listingid: string
  ): Promise<string> {
    validateUUID(userid, "user ID")
    validateUUID(listingid, "listing ID")
    return new CartService().addToCart(listingid, userid)
  }

  @Authorized()
  @Mutation(() => String)
  async removeFromCart(
    @Arg("userid") userid: string,
    @Arg("listingid") listingid: string
  ): Promise<string> {
    validateUUID(userid, "user ID")
    validateUUID(listingid, "listing ID")
    return new CartService().removeFromCart(listingid, userid)
  }

  @Authorized()
  @Mutation(() => Boolean)
  async clearCart(
    @Arg("userid") userid: string,
  ): Promise<boolean> {
    validateUUID(userid, "user ID")
    return new CartService().clearCart(userid)
  }

  @Mutation(() => String)
  async createGuestShopper(): Promise<string> {
    return new CartService().createGuestShopper()
  }

  @Mutation(() => Boolean)
  async mergeCarts(
    @Arg("guestId") guestId: string,
    @Arg("userId") userId: string
  ): Promise<boolean> {
    validateUUID(guestId, "guest ID")
    validateUUID(userId, "user ID")
    return new CartService().mergeCarts(guestId, userId)
  }
}
