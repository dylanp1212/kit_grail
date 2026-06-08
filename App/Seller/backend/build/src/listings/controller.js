"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingsController = void 0;
const tsoa_1 = require("tsoa");
const express = __importStar(require("express"));
const service_1 = require("./service");
let ListingsController = class ListingsController extends tsoa_1.Controller {
    async getMyListings(request) {
        const userID = request.user?.id;
        if (!userID) {
            this.setStatus(401);
            return [];
        }
        this.setStatus(200);
        return new service_1.ListingService().getMyListings(userID);
    }
    async getListing(listingID) {
        const listing = await new service_1.ListingService().getListing(listingID);
        if (!listing) {
            this.setStatus(404);
            return undefined;
        }
        this.setStatus(200);
        return listing;
    }
    async createNewListing(newListing, request) {
        const userID = request.user?.id;
        const cookies = request.cookies;
        const jwe = typeof cookies?.seller_session === 'string'
            ? cookies.seller_session
            : undefined;
        if (!userID || !jwe) {
            this.setStatus(401);
            return undefined;
        }
        const listing = await new service_1.ListingService().createNewListing({ ...newListing, seller: userID }, jwe);
        if (!listing) {
            this.setStatus(400);
            return undefined;
        }
        this.setStatus(201);
        return listing;
    }
    async editListing(listing, request, listingID) {
        const userID = request.user?.id;
        const cookies = request.cookies;
        const jwe = typeof cookies?.seller_session === 'string'
            ? cookies.seller_session
            : undefined;
        if (!userID || !jwe) {
            this.setStatus(401);
            return undefined;
        }
        const updated = await new service_1.ListingService().editListing(listing, listingID, jwe);
        if (!updated) {
            this.setStatus(400);
            return undefined;
        }
        this.setStatus(200);
        return updated;
    }
};
exports.ListingsController = ListingsController;
__decorate([
    (0, tsoa_1.Get)('all'),
    (0, tsoa_1.Response)('200', 'OK'),
    (0, tsoa_1.Response)('401', 'Unauthorised'),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "getMyListings", null);
__decorate([
    (0, tsoa_1.Get)('{listingID}'),
    (0, tsoa_1.Response)('200', 'OK'),
    (0, tsoa_1.Response)('404', 'Not Found'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "getListing", null);
__decorate([
    (0, tsoa_1.Post)(),
    (0, tsoa_1.Response)('201', 'OK'),
    (0, tsoa_1.Response)('400', 'Bad seller ID'),
    (0, tsoa_1.Response)('401', 'Unauthorised'),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "createNewListing", null);
__decorate([
    (0, tsoa_1.Patch)(`{listingID}`),
    (0, tsoa_1.Response)('201', 'OK'),
    (0, tsoa_1.Response)('401', 'Unauthorised'),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Request)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "editListing", null);
exports.ListingsController = ListingsController = __decorate([
    (0, tsoa_1.Route)('my-listings')
], ListingsController);
