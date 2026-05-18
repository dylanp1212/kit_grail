import {
  Query,
  Resolver,
  Mutation,
  Arg,
  Authorized,
} from "type-graphql"

import { GraphQLError } from "graphql"

import { WishlistItem } from "./schema"
import { WishlistService } from "./service"

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const validateUUID = (
  id: string,
  field: string
) => {
  if (!UUID_RE.test(id)) {
    throw new GraphQLError(
      `Invalid ${field} format`
    )
  }
}

@Resolver()
export class WishlistResolver {
  @Authorized()
  @Query(() => [WishlistItem])
  async getAllWishlistItems(
    @Arg("userid") userid: string,
    @Arg("search", { nullable: true })
    search?: string
  ): Promise<WishlistItem[]> {
    validateUUID(userid, "user ID")

    return new WishlistService()
      .getAllWishlistItems(userid, search)
  }

  @Authorized()
  @Query(() => Boolean)
  async checkInWishlist(
    @Arg("userid") userid: string,
    @Arg("listingid") listingid: string
  ): Promise<boolean> {
    validateUUID(userid, "user ID")
    validateUUID(listingid, "listing ID")

    return new WishlistService()
      .checkInWishlist(listingid, userid)
  }

  @Authorized()
  @Mutation(() => WishlistItem, {
    nullable: true,
  })
  async addToWishlist(
    @Arg("userid") userid: string,
    @Arg("listingid") listingid: string
  ): Promise<WishlistItem | null> {
    validateUUID(userid, "user ID")
    validateUUID(listingid, "listing ID")

    const item =
      await new WishlistService()
        .addToWishlist(listingid, userid)

    if (!item) {
      throw new GraphQLError(
        "Already in wishlist"
      )
    }

    return item
  }

  @Authorized()
  @Mutation(() => String)
  async removeFromWishlist(
    @Arg("userid") userid: string,
    @Arg("listingid") listingid: string
  ): Promise<string> {
    validateUUID(userid, "user ID")
    validateUUID(listingid, "listing ID")

    return new WishlistService()
      .removeFromWishlist(listingid, userid)
  }
}