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
exports.WishlistController = void 0;
const tsoa_1 = require("tsoa");
const service_1 = require("./service");
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
let WishlistController = class WishlistController extends tsoa_1.Controller {
    async getAllWishlistItems(userid, search) {
        if (!UUID_RE.test(userid)) {
            this.setStatus(400);
            return undefined;
        }
        return new service_1.WishlistService().getAllWishlistItems(userid, search);
    }
    async checkInWishlist(userid, listingid) {
        if (!UUID_RE.test(userid) || !UUID_RE.test(listingid)) {
            this.setStatus(400);
            return undefined;
        }
        return new service_1.WishlistService().checkInWishlist(listingid, userid);
    }
    async addToWishlist(userid, listingid) {
        if (!UUID_RE.test(userid) || !UUID_RE.test(listingid)) {
            this.setStatus(400);
            return undefined;
        }
        const item = await new service_1.WishlistService().addToWishlist(listingid, userid);
        if (!item) {
            this.setStatus(409);
            return undefined;
        }
        this.setStatus(201);
        return item;
    }
    async removeFromWishlist(userid, listingid) {
        if (!UUID_RE.test(userid) || !UUID_RE.test(listingid)) {
            this.setStatus(400);
            return undefined;
        }
        return new service_1.WishlistService().removeFromWishlist(listingid, userid);
    }
};
exports.WishlistController = WishlistController;
__decorate([
    (0, tsoa_1.Get)('{userid}'),
    (0, tsoa_1.Response)('400', 'Invalid user ID format'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "getAllWishlistItems", null);
__decorate([
    (0, tsoa_1.Get)('{userid}/{listingid}'),
    (0, tsoa_1.Response)('400', 'Invalid ID format'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "checkInWishlist", null);
__decorate([
    (0, tsoa_1.Post)('{userid}/{listingid}'),
    (0, tsoa_1.SuccessResponse)('201', 'Added to wishlist'),
    (0, tsoa_1.Response)('400', 'Invalid ID format'),
    (0, tsoa_1.Response)('409', 'Already in wishlist'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "addToWishlist", null);
__decorate([
    (0, tsoa_1.Delete)('{userid}/{listingid}'),
    (0, tsoa_1.Response)('400', 'Invalid ID format'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "removeFromWishlist", null);
exports.WishlistController = WishlistController = __decorate([
    (0, tsoa_1.Route)('wishlist')
], WishlistController);
