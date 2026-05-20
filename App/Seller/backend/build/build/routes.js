"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = RegisterRoutes;
const runtime_1 = require("@tsoa/runtime");
const controller_1 = require("./../src/orders/controller");
const controller_2 = require("./../src/listings/controller");
const controller_3 = require("./../src/keys/controller");
const models = {
    "OrderItem": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "kit_listing": { "dataType": "string", "required": true },
            "title": { "dataType": "string", "required": true },
            "price": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    "SellerOrder": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "shopper": { "dataType": "string", "required": true },
            "status": { "dataType": "string", "required": true },
            "paid_at": { "dataType": "string", "required": true },
            "items": { "dataType": "array", "array": { "dataType": "refObject", "ref": "OrderItem" }, "required": true },
        },
        "additionalProperties": false,
    },
    "Size": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["xsmall"] }, { "dataType": "enum", "enums": ["small"] }, { "dataType": "enum", "enums": ["medium"] }, { "dataType": "enum", "enums": ["large"] }, { "dataType": "enum", "enums": ["xlarge"] }], "validators": {} },
    },
    "MyListings": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "seller": { "dataType": "string", "required": true },
            "title": { "dataType": "string", "required": true },
            "description": { "dataType": "string", "required": true },
            "size": { "ref": "Size", "required": true },
            "colors": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "listed": { "dataType": "datetime", "required": true },
            "price": { "dataType": "double", "required": true },
            "image": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    "NewListing": {
        "dataType": "refObject",
        "properties": {
            "seller": { "dataType": "string", "required": true },
            "title": { "dataType": "string", "required": true },
            "description": { "dataType": "string", "required": true },
            "size": { "ref": "Size", "required": true },
            "colors": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "price": { "dataType": "double", "required": true },
            "image": { "dataType": "string" },
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
};
const templateService = new runtime_1.ExpressTemplateService(models, { "noImplicitAdditionalProperties": "throw-on-extras", "bodyCoercion": true });
function RegisterRoutes(app) {
    const argsOrdersController_getOrders = {
        sellerID: { "in": "query", "name": "sellerID", "required": true, "dataType": "string" },
    };
    app.get('/my-orders', ...((0, runtime_1.fetchMiddlewares)(controller_1.OrdersController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.OrdersController.prototype.getOrders)), async function OrdersController_getOrders(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsOrdersController_getOrders, request, response });
            const controller = new controller_1.OrdersController();
            await templateService.apiHandler({
                methodName: 'getOrders',
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
    const argsListingsController_getMyListings = {
        userID: { "in": "query", "name": "userID", "required": true, "dataType": "string" },
    };
    app.get('/my-listings/all', ...((0, runtime_1.fetchMiddlewares)(controller_2.ListingsController)), ...((0, runtime_1.fetchMiddlewares)(controller_2.ListingsController.prototype.getMyListings)), async function ListingsController_getMyListings(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsListingsController_getMyListings, request, response });
            const controller = new controller_2.ListingsController();
            await templateService.apiHandler({
                methodName: 'getMyListings',
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
    const argsListingsController_getListing = {
        listingID: { "in": "path", "name": "listingID", "required": true, "dataType": "string" },
    };
    app.get('/my-listings/:listingID', ...((0, runtime_1.fetchMiddlewares)(controller_2.ListingsController)), ...((0, runtime_1.fetchMiddlewares)(controller_2.ListingsController.prototype.getListing)), async function ListingsController_getListing(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsListingsController_getListing, request, response });
            const controller = new controller_2.ListingsController();
            await templateService.apiHandler({
                methodName: 'getListing',
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
    const argsListingsController_createNewListing = {
        newListing: { "in": "body", "name": "newListing", "required": true, "ref": "NewListing" },
    };
    app.post('/my-listings', ...((0, runtime_1.fetchMiddlewares)(controller_2.ListingsController)), ...((0, runtime_1.fetchMiddlewares)(controller_2.ListingsController.prototype.createNewListing)), async function ListingsController_createNewListing(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsListingsController_createNewListing, request, response });
            const controller = new controller_2.ListingsController();
            await templateService.apiHandler({
                methodName: 'createNewListing',
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
    const argsKeysController_list = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    app.get('/keys', ...((0, runtime_1.fetchMiddlewares)(controller_3.KeysController)), ...((0, runtime_1.fetchMiddlewares)(controller_3.KeysController.prototype.list)), async function KeysController_list(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsKeysController_list, request, response });
            const controller = new controller_3.KeysController();
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
    const argsKeysController_create = {
        body: { "in": "body", "name": "body", "required": true, "ref": "CreateKeyRequest" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    app.post('/keys', ...((0, runtime_1.fetchMiddlewares)(controller_3.KeysController)), ...((0, runtime_1.fetchMiddlewares)(controller_3.KeysController.prototype.create)), async function KeysController_create(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsKeysController_create, request, response });
            const controller = new controller_3.KeysController();
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
    const argsKeysController_revoke = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    app.delete('/keys/:id', ...((0, runtime_1.fetchMiddlewares)(controller_3.KeysController)), ...((0, runtime_1.fetchMiddlewares)(controller_3.KeysController.prototype.revoke)), async function KeysController_revoke(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsKeysController_revoke, request, response });
            const controller = new controller_3.KeysController();
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
}
