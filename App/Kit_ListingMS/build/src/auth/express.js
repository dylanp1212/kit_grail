"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = expressAuthentication;
const service_1 = require("./service");
function expressAuthentication(request, securityName, scopes) {
    return new service_1.ApiKeyService().lookup(request.headers.authorization);
}
