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
exports.HistoryController = void 0;
const tsoa_1 = require("tsoa");
const service_1 = require("./service");
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
let HistoryController = class HistoryController extends tsoa_1.Controller {
    async getListingHistory(id) {
        if (!UUID_RE.test(id)) {
            this.setStatus(400);
            return undefined;
        }
        const svc = new service_1.HistoryService();
        const cached = await svc.getCached(id);
        if (cached)
            return cached;
        try {
            const generated = await svc.generateForListing(id);
            if (!generated) {
                this.setStatus(404);
                return undefined;
            }
            return generated;
        }
        catch {
            this.setStatus(503);
            return undefined;
        }
    }
};
exports.HistoryController = HistoryController;
__decorate([
    (0, tsoa_1.Get)('listings/{id}'),
    (0, tsoa_1.Response)('400', 'Invalid listing id'),
    (0, tsoa_1.Response)('404', 'Listing not found or no usable corpus yet'),
    (0, tsoa_1.Response)('503', 'Generation failed; try again later'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "getListingHistory", null);
exports.HistoryController = HistoryController = __decorate([
    (0, tsoa_1.Route)('history')
], HistoryController);
