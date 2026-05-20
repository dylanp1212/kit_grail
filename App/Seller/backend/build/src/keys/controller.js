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
exports.KeysController = void 0;
const tsoa_1 = require("tsoa");
const express = __importStar(require("express"));
const service_1 = require("./service");
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function jweFromRequest(request) {
    const cookie = request.cookies?.seller_session;
    return typeof cookie === 'string' ? cookie : undefined;
}
let KeysController = class KeysController extends tsoa_1.Controller {
    async list(request) {
        const jwe = jweFromRequest(request);
        if (!jwe) {
            this.setStatus(401);
            return [];
        }
        return new service_1.KeysService().list(jwe);
    }
    async create(body, request) {
        const jwe = jweFromRequest(request);
        if (!jwe) {
            this.setStatus(401);
            return undefined;
        }
        this.setStatus(201);
        return new service_1.KeysService().create(jwe, body);
    }
    async revoke(id, request) {
        if (!UUID_RE.test(id)) {
            this.setStatus(400);
            return;
        }
        const jwe = jweFromRequest(request);
        if (!jwe) {
            this.setStatus(401);
            return;
        }
        const ok = await new service_1.KeysService().revoke(jwe, id);
        this.setStatus(ok ? 204 : 404);
    }
};
exports.KeysController = KeysController;
__decorate([
    (0, tsoa_1.Get)(),
    (0, tsoa_1.Response)('401', 'Unauthorised'),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KeysController.prototype, "list", null);
__decorate([
    (0, tsoa_1.Post)(),
    (0, tsoa_1.SuccessResponse)('201', 'Created'),
    (0, tsoa_1.Response)('401', 'Unauthorised'),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], KeysController.prototype, "create", null);
__decorate([
    (0, tsoa_1.Delete)('{id}'),
    (0, tsoa_1.SuccessResponse)('204', 'No Content'),
    (0, tsoa_1.Response)('400', 'Invalid ID format'),
    (0, tsoa_1.Response)('401', 'Unauthorised'),
    (0, tsoa_1.Response)('404', 'Not found'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], KeysController.prototype, "revoke", null);
exports.KeysController = KeysController = __decorate([
    (0, tsoa_1.Route)('keys')
], KeysController);
