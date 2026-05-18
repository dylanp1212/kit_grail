"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartResolver = void 0;
const type_graphql_1 = require("type-graphql");
const graphql_1 = require("graphql");
const schema_1 = require("./schema");
const service_1 = require("./service");
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const validateUUID = (id, field) => {
    if (!UUID_RE.test(id)) {
        throw new graphql_1.GraphQLError(`Invalid ${field} format`);
    }
};
let CartResolver = class CartResolver {
    async getAllCartItems(userid) {
        validateUUID(userid, "user ID");
        return new service_1.CartService().getAllCartItems(userid);
    }
    async checkInCart(userid, listingid) {
        validateUUID(userid, "user ID");
        validateUUID(listingid, "listing ID");
        return new service_1.CartService().checkInCart(listingid, userid);
    }
    async addToCart(userid, listingid) {
        validateUUID(userid, "user ID");
        validateUUID(listingid, "listing ID");
        return new service_1.CartService().addToCart(listingid, userid);
    }
    async removeFromCart(userid, listingid) {
        validateUUID(userid, "user ID");
        validateUUID(listingid, "listing ID");
        return new service_1.CartService().removeFromCart(listingid, userid);
    }
    async createGuestShopper() {
        return new service_1.CartService().createGuestShopper();
    }
};
exports.CartResolver = CartResolver;
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Query)(() => [schema_1.CartItem]),
    __param(0, (0, type_graphql_1.Arg)("userid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "getAllCartItems", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Query)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("userid")),
    __param(1, (0, type_graphql_1.Arg)("listingid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "checkInCart", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("userid")),
    __param(1, (0, type_graphql_1.Arg)("listingid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "addToCart", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("userid")),
    __param(1, (0, type_graphql_1.Arg)("listingid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "removeFromCart", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "createGuestShopper", null);
exports.CartResolver = CartResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CartResolver);
