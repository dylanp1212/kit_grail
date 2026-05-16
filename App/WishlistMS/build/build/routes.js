"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = RegisterRoutes;
const runtime_1 = require("@tsoa/runtime");
const controller_1 = require("./../src/wishlist/controller");
const models = {
    "Size": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["xsmall"] }, { "dataType": "enum", "enums": ["small"] }, { "dataType": "enum", "enums": ["medium"] }, { "dataType": "enum", "enums": ["large"] }, { "dataType": "enum", "enums": ["xlarge"] }], "validators": {} },
    },
    "WishlistItem": {
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
            "added": { "dataType": "datetime", "required": true },
        },
        "additionalProperties": false,
    },
};
const templateService = new runtime_1.ExpressTemplateService(models, { "noImplicitAdditionalProperties": "throw-on-extras", "bodyCoercion": true });
function RegisterRoutes(app) {
    const argsWishlistController_getAllWishlistItems = {
        userid: { "in": "path", "name": "userid", "required": true, "dataType": "string" },
        search: { "in": "query", "name": "search", "dataType": "string" },
    };
    app.get('/wishlist/:userid', ...((0, runtime_1.fetchMiddlewares)(controller_1.WishlistController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.WishlistController.prototype.getAllWishlistItems)), async function WishlistController_getAllWishlistItems(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsWishlistController_getAllWishlistItems, request, response });
            const controller = new controller_1.WishlistController();
            await templateService.apiHandler({
                methodName: 'getAllWishlistItems',
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
    const argsWishlistController_checkInWishlist = {
        userid: { "in": "path", "name": "userid", "required": true, "dataType": "string" },
        listingid: { "in": "path", "name": "listingid", "required": true, "dataType": "string" },
    };
    app.get('/wishlist/:userid/:listingid', ...((0, runtime_1.fetchMiddlewares)(controller_1.WishlistController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.WishlistController.prototype.checkInWishlist)), async function WishlistController_checkInWishlist(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsWishlistController_checkInWishlist, request, response });
            const controller = new controller_1.WishlistController();
            await templateService.apiHandler({
                methodName: 'checkInWishlist',
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
    const argsWishlistController_addToWishlist = {
        userid: { "in": "path", "name": "userid", "required": true, "dataType": "string" },
        listingid: { "in": "path", "name": "listingid", "required": true, "dataType": "string" },
    };
    app.post('/wishlist/:userid/:listingid', ...((0, runtime_1.fetchMiddlewares)(controller_1.WishlistController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.WishlistController.prototype.addToWishlist)), async function WishlistController_addToWishlist(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsWishlistController_addToWishlist, request, response });
            const controller = new controller_1.WishlistController();
            await templateService.apiHandler({
                methodName: 'addToWishlist',
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
    const argsWishlistController_removeFromWishlist = {
        userid: { "in": "path", "name": "userid", "required": true, "dataType": "string" },
        listingid: { "in": "path", "name": "listingid", "required": true, "dataType": "string" },
    };
    app.delete('/wishlist/:userid/:listingid', ...((0, runtime_1.fetchMiddlewares)(controller_1.WishlistController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.WishlistController.prototype.removeFromWishlist)), async function WishlistController_removeFromWishlist(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsWishlistController_removeFromWishlist, request, response });
            const controller = new controller_1.WishlistController();
            await templateService.apiHandler({
                methodName: 'removeFromWishlist',
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
}
