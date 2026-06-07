"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = RegisterRoutes;
const runtime_1 = require("@tsoa/runtime");
const controller_1 = require("./../src/history/controller");
const controller_2 = require("./../src/health/controller");
const models = {
    "Citation": {
        "dataType": "refObject",
        "properties": {
            "index": { "dataType": "double", "required": true },
            "url": { "dataType": "string", "required": true },
            "title": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    "ListingHistory": {
        "dataType": "refObject",
        "properties": {
            "summary": { "dataType": "string", "required": true },
            "citations": { "dataType": "array", "array": { "dataType": "refObject", "ref": "Citation" }, "required": true },
            "generated_at": { "dataType": "string", "required": true },
            "cached": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    "Health": {
        "dataType": "refObject",
        "properties": {
            "status": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
};
const templateService = new runtime_1.ExpressTemplateService(models, { "noImplicitAdditionalProperties": "throw-on-extras", "bodyCoercion": true });
function RegisterRoutes(app) {
    const argsHistoryController_getListingHistory = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
    };
    app.get('/history/listings/:id', ...((0, runtime_1.fetchMiddlewares)(controller_1.HistoryController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.HistoryController.prototype.getListingHistory)), async function HistoryController_getListingHistory(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsHistoryController_getListingHistory, request, response });
            const controller = new controller_1.HistoryController();
            await templateService.apiHandler({
                methodName: 'getListingHistory',
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
    const argsHealthController_get = {};
    app.get('/health', ...((0, runtime_1.fetchMiddlewares)(controller_2.HealthController)), ...((0, runtime_1.fetchMiddlewares)(controller_2.HealthController.prototype.get)), async function HealthController_get(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsHealthController_get, request, response });
            const controller = new controller_2.HealthController();
            await templateService.apiHandler({
                methodName: 'get',
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
