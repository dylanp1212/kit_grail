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
exports.ListingController = void 0;
const tsoa_1 = require("tsoa");
const service_1 = require("./service");
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
let ListingController = class ListingController extends tsoa_1.Controller {
    async getAllKitListings(search, sellerId) {
        return new service_1.ListingService().getAllKitListings(search, sellerId);
    }
    async getKitListingById(id) {
        if (!UUID_RE.test(id)) {
            this.setStatus(400);
            return undefined;
        }
        const listing = await new service_1.ListingService().getKitListingById(id);
        if (!listing) {
            this.setStatus(404);
            return undefined;
        }
        return listing;
    }
    async createNewKitListing(newListing) {
        if (!UUID_RE.test(newListing.seller)) {
            this.setStatus(400);
            return undefined;
        }
        this.setStatus(201);
        return new service_1.ListingService().createNewKitListing(newListing);
    }
};
exports.ListingController = ListingController;
__decorate([
    (0, tsoa_1.Get)(),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ListingController.prototype, "getAllKitListings", null);
__decorate([
    (0, tsoa_1.Get)('{id}'),
    (0, tsoa_1.Response)('400', 'Invalid ID format'),
    (0, tsoa_1.Response)('404', 'Not found'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ListingController.prototype, "getKitListingById", null);
__decorate([
    (0, tsoa_1.Post)(),
    (0, tsoa_1.Response)('400', 'Invalid seller ID format'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ListingController.prototype, "createNewKitListing", null);
exports.ListingController = ListingController = __decorate([
    (0, tsoa_1.Route)('kit-listing')
], ListingController);
