"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = RegisterRoutes;
const runtime_1 = require("@tsoa/runtime");
const controller_1 = require("./../src/seller_listings/controller");
const controller_2 = require("./../src/seller_keys/controller");
const controller_3 = require("./../src/kit_listing/controller");
const express_1 = require("./../src/auth/express");
const expressAuthenticationRecasted = express_1.expressAuthentication;
const models = {
    "Size": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["xsmall"] }, { "dataType": "enum", "enums": ["small"] }, { "dataType": "enum", "enums": ["medium"] }, { "dataType": "enum", "enums": ["large"] }, { "dataType": "enum", "enums": ["xlarge"] }], "validators": {} },
    },
    "KitListing": {
        "dataType": "refObject",
        "properties": {
            "seller": { "dataType": "string", "required": true },
            "title": { "dataType": "string", "required": true },
            "description": { "dataType": "string", "required": true },
            "size": { "ref": "Size", "required": true },
            "colors": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "price": { "dataType": "double", "required": true },
            "image": { "dataType": "string" },
            "quantity": { "dataType": "double", "required": true },
            "id": { "dataType": "string", "required": true },
            "listed": { "dataType": "datetime", "required": true },
            "active": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    "NewSellerListing": {
        "dataType": "refObject",
        "properties": {
            "title": { "dataType": "string", "required": true },
            "description": { "dataType": "string", "required": true },
            "size": { "ref": "Size", "required": true },
            "colors": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "price": { "dataType": "double", "required": true },
            "image": { "dataType": "string" },
            "quantity": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    "ListingPatch": {
        "dataType": "refObject",
        "properties": {
            "title": { "dataType": "string" },
            "description": { "dataType": "string" },
            "size": { "ref": "Size" },
            "colors": { "dataType": "array", "array": { "dataType": "string" } },
            "price": { "dataType": "double" },
            "image": { "dataType": "string" },
            "quantity": { "dataType": "double" },
        },
        "additionalProperties": false,
    },
    "KeyCreated": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "prefix": { "dataType": "string", "required": true },
            "plaintext": { "dataType": "string", "required": true },
            "label": { "dataType": "string", "required": true },
            "created_at": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    "CreateKeyRequest": {
        "dataType": "refObject",
        "properties": {
            "label": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    "KeyMetadata": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "prefix": { "dataType": "string", "required": true },
            "label": { "dataType": "string" },
            "created_at": { "dataType": "string" },
            "revoked_at": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    "NewKitListing": {
        "dataType": "refObject",
        "properties": {
            "seller": { "dataType": "string", "required": true },
            "title": { "dataType": "string", "required": true },
            "description": { "dataType": "string", "required": true },
            "size": { "ref": "Size", "required": true },
            "colors": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "price": { "dataType": "double", "required": true },
            "image": { "dataType": "string" },
            "quantity": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    "KitListingPatch": {
        "dataType": "refObject",
        "properties": {
            "title": { "dataType": "string" },
            "description": { "dataType": "string" },
            "size": { "ref": "Size" },
            "colors": { "dataType": "array", "array": { "dataType": "string" } },
            "price": { "dataType": "double" },
            "image": { "dataType": "string" },
            "active": { "dataType": "boolean" },
            "quantity": { "dataType": "double" },
        },
        "additionalProperties": false,
    },
};
const templateService = new runtime_1.ExpressTemplateService(models, { "noImplicitAdditionalProperties": "throw-on-extras", "bodyCoercion": true });
function RegisterRoutes(app) {
    const argsSellerListingsController_create = {
        body: { "in": "body", "name": "body", "required": true, "ref": "NewSellerListing" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    app.post('/seller/listings', authenticateMiddleware([{ "apiKey": [] }]), ...((0, runtime_1.fetchMiddlewares)(controller_1.SellerListingsController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.SellerListingsController.prototype.create)), async function SellerListingsController_create(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSellerListingsController_create, request, response });
            const controller = new controller_1.SellerListingsController();
            await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    const argsSellerListingsController_list = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        search: { "in": "query", "name": "search", "dataType": "string" },
    };
    app.get('/seller/listings', authenticateMiddleware([{ "apiKey": [] }]), ...((0, runtime_1.fetchMiddlewares)(controller_1.SellerListingsController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.SellerListingsController.prototype.list)), async function SellerListingsController_list(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSellerListingsController_list, request, response });
            const controller = new controller_1.SellerListingsController();
            await templateService.apiHandler({
                methodName: 'list',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    const argsSellerListingsController_update = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "ref": "ListingPatch" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    app.patch('/seller/listings/:id', authenticateMiddleware([{ "apiKey": [] }]), ...((0, runtime_1.fetchMiddlewares)(controller_1.SellerListingsController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.SellerListingsController.prototype.update)), async function SellerListingsController_update(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSellerListingsController_update, request, response });
            const controller = new controller_1.SellerListingsController();
            await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    const argsSellerListingsController_remove = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    app.delete('/seller/listings/:id', authenticateMiddleware([{ "apiKey": [] }]), ...((0, runtime_1.fetchMiddlewares)(controller_1.SellerListingsController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.SellerListingsController.prototype.remove)), async function SellerListingsController_remove(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSellerListingsController_remove, request, response });
            const controller = new controller_1.SellerListingsController();
            await templateService.apiHandler({
                methodName: 'remove',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    const argsSellerKeysController_create = {
        body: { "in": "body", "name": "body", "required": true, "ref": "CreateKeyRequest" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    app.post('/seller/keys', authenticateMiddleware([{ "jwe": [] }]), ...((0, runtime_1.fetchMiddlewares)(controller_2.SellerKeysController)), ...((0, runtime_1.fetchMiddlewares)(controller_2.SellerKeysController.prototype.create)), async function SellerKeysController_create(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSellerKeysController_create, request, response });
            const controller = new controller_2.SellerKeysController();
            await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    const argsSellerKeysController_list = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    app.get('/seller/keys', authenticateMiddleware([{ "jwe": [] }]), ...((0, runtime_1.fetchMiddlewares)(controller_2.SellerKeysController)), ...((0, runtime_1.fetchMiddlewares)(controller_2.SellerKeysController.prototype.list)), async function SellerKeysController_list(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSellerKeysController_list, request, response });
            const controller = new controller_2.SellerKeysController();
            await templateService.apiHandler({
                methodName: 'list',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    const argsSellerKeysController_revoke = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    app.delete('/seller/keys/:id', authenticateMiddleware([{ "jwe": [] }]), ...((0, runtime_1.fetchMiddlewares)(controller_2.SellerKeysController)), ...((0, runtime_1.fetchMiddlewares)(controller_2.SellerKeysController.prototype.revoke)), async function SellerKeysController_revoke(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSellerKeysController_revoke, request, response });
            const controller = new controller_2.SellerKeysController();
            await templateService.apiHandler({
                methodName: 'revoke',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    const argsListingController_getAllKitListings = {
        search: { "in": "query", "name": "search", "dataType": "string" },
        sellerId: { "in": "query", "name": "sellerId", "dataType": "string" },
        sizes: { "in": "query", "name": "sizes", "dataType": "array", "array": { "dataType": "refAlias", "ref": "Size" } },
        colors: { "in": "query", "name": "colors", "dataType": "array", "array": { "dataType": "string" } },
        includeAll: { "in": "query", "name": "includeAll", "dataType": "boolean" },
    };
    app.get('/kit-listing', ...((0, runtime_1.fetchMiddlewares)(controller_3.ListingController)), ...((0, runtime_1.fetchMiddlewares)(controller_3.ListingController.prototype.getAllKitListings)), async function ListingController_getAllKitListings(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsListingController_getAllKitListings, request, response });
            const controller = new controller_3.ListingController();
            await templateService.apiHandler({
                methodName: 'getAllKitListings',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    const argsListingController_getKitListingById = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
    };
    app.get('/kit-listing/:id', ...((0, runtime_1.fetchMiddlewares)(controller_3.ListingController)), ...((0, runtime_1.fetchMiddlewares)(controller_3.ListingController.prototype.getKitListingById)), async function ListingController_getKitListingById(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsListingController_getKitListingById, request, response });
            const controller = new controller_3.ListingController();
            await templateService.apiHandler({
                methodName: 'getKitListingById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    const argsListingController_createNewKitListing = {
        newListing: { "in": "body", "name": "newListing", "required": true, "ref": "NewKitListing" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    app.post('/kit-listing', authenticateMiddleware([{ "jwe": [] }]), ...((0, runtime_1.fetchMiddlewares)(controller_3.ListingController)), ...((0, runtime_1.fetchMiddlewares)(controller_3.ListingController.prototype.createNewKitListing)), async function ListingController_createNewKitListing(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsListingController_createNewKitListing, request, response });
            const controller = new controller_3.ListingController();
            await templateService.apiHandler({
                methodName: 'createNewKitListing',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    const argsListingController_editKitListing = {
        listing: { "in": "body", "name": "listing", "required": true, "ref": "KitListingPatch" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
    };
    app.patch('/kit-listing/:id', authenticateMiddleware([{ "jwe": [] }]), ...((0, runtime_1.fetchMiddlewares)(controller_3.ListingController)), ...((0, runtime_1.fetchMiddlewares)(controller_3.ListingController.prototype.editKitListing)), async function ListingController_editKitListing(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsListingController_editKitListing, request, response });
            const controller = new controller_3.ListingController();
            await templateService.apiHandler({
                methodName: 'editKitListing',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    function authenticateMiddleware(security = []) {
        return async function runAuthenticationMiddleware(request, response, next) {
            const failedAttempts = [];
            const pushAndRethrow = (error) => {
                failedAttempts.push(error);
                throw error;
            };
            const secMethodOrPromises = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises = [];
                    for (const name in secMethod) {
                        secMethodAndPromises.push(expressAuthenticationRecasted(request, name, secMethod[name], response)
                            .catch(pushAndRethrow));
                    }
                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                }
                else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(expressAuthenticationRecasted(request, name, secMethod[name], response)
                            .catch(pushAndRethrow));
                    }
                }
            }
            try {
                request['user'] = await Promise.any(secMethodOrPromises);
                if (response.writableEnded) {
                    return;
                }
                next();
            }
            catch (err) {
                const error = failedAttempts.pop();
                error.status = error.status || 401;
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }
        };
    }
}
