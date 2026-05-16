"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = RegisterRoutes;
const runtime_1 = require("@tsoa/runtime");
const controller_1 = require("./../src/kit_listing/controller");
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
            "id": { "dataType": "string", "required": true },
            "listed": { "dataType": "datetime", "required": true },
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
        },
        "additionalProperties": false,
    },
};
const templateService = new runtime_1.ExpressTemplateService(models, { "noImplicitAdditionalProperties": "throw-on-extras", "bodyCoercion": true });
function RegisterRoutes(app) {
    const argsListingController_getAllKitListings = {
        search: { "in": "query", "name": "search", "dataType": "string" },
        sellerId: { "in": "query", "name": "sellerId", "dataType": "string" },
    };
    app.get('/kit-listing', ...((0, runtime_1.fetchMiddlewares)(controller_1.ListingController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.ListingController.prototype.getAllKitListings)), async function ListingController_getAllKitListings(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsListingController_getAllKitListings, request, response });
            const controller = new controller_1.ListingController();
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
    app.get('/kit-listing/:id', ...((0, runtime_1.fetchMiddlewares)(controller_1.ListingController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.ListingController.prototype.getKitListingById)), async function ListingController_getKitListingById(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsListingController_getKitListingById, request, response });
            const controller = new controller_1.ListingController();
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
    };
    app.post('/kit-listing', ...((0, runtime_1.fetchMiddlewares)(controller_1.ListingController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.ListingController.prototype.createNewKitListing)), async function ListingController_createNewKitListing(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsListingController_createNewKitListing, request, response });
            const controller = new controller_1.ListingController();
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
}
