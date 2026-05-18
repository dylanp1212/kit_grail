"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
(0, app_1.bootstrap)().then(() => {
    app_1.app.listen(3015, () => {
        console.log('Server Running on port 3015');
        console.log('GraphQL: http://localhost:3015/graphql');
        console.log('Playground: http://localhost:3015/playground');
    });
});
