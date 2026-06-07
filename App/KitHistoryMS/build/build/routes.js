"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = RegisterRoutes;
const runtime_1 = require("@tsoa/runtime");
const controller_1 = require("./../src/health/controller");
const models = {
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
    const argsHealthController_get = {};
    app.get('/health', ...((0, runtime_1.fetchMiddlewares)(controller_1.HealthController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.HealthController.prototype.get)), async function HealthController_get(request, response, next) {
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsHealthController_get, request, response });
            const controller = new controller_1.HealthController();
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
