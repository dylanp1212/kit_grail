"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = RegisterRoutes;
const runtime_1 = require("@tsoa/runtime");
const controller_1 = require("./../src/listings/controller");
const models = {
    "Size": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["xsmall"] }, { "dataType": "enum", "enums": ["small"] }, { "dataType": "enum", "enums": ["medium"] }, { "dataType": "enum", "enums": ["large"] }, { "dataType": "enum", "enums": ["xlarge"] }], "validators": {} },
    },
    "MyListings": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "title": { "dataType": "string", "required": true },
            "description": { "dataType": "string", "required": true },
            "size": { "ref": "Size", "required": true },
            "colors": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "listed": { "dataType": "string", "required": true },
            "price": { "dataType": "double", "required": true },
            "image": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
};
const templateService = new runtime_1.ExpressTemplateService(models, { "noImplicitAdditionalProperties": "throw-on-extras", "bodyCoercion": true });
function RegisterRoutes(app) {
    const argsListingsController_getMyListings = {
        request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
    };
    app.get('/my-listings', ...((0, runtime_1.fetchMiddlewares)(controller_1.ListingsController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.ListingsController.prototype.getMyListings)), async function ListingsController_getMyListings(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsListingsController_getMyListings, request, response });
            const controller = new controller_1.ListingsController();
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
}
