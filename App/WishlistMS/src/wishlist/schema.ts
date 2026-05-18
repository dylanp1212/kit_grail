import {
  Field,
  ObjectType,
  registerEnumType,
} from "type-graphql"

export enum Size {
  XSMALL = "xsmall",
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  XLARGE = "xlarge",
}

registerEnumType(Size, {
  name: "Size",
})

@ObjectType()
export class KitListing {
  @Field()
  id!: string

  @Field()
  seller!: string

  @Field()
  title!: string

  @Field()
  description!: string

  @Field(() => Size)
  size!: Size

  @Field(() => [String])
  colors!: string[]

  @Field()
  listed!: Date

  @Field()
  price!: number

  @Field({ nullable: true })
  image?: string
}

@ObjectType()
export class WishlistItem extends KitListing {
  @Field()
  added!: Date
}