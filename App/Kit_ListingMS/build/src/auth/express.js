"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = expressAuthentication;
const service_1 = require("./service");
const jwe_1 = require("./jwe");
function expressAuthentication(request, securityName, scopes) {
    if (securityName === 'jwe') {
        return new jwe_1.JweAuthService().lookup(request.headers.authorization);
    }
    return new service_1.ApiKeyService().lookup(request.headers.authorization);
}
