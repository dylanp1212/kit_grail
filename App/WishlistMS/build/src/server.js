"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
(0, app_1.bootstrap)().then(() => {
    app_1.app.listen(3012, () => {
        console.log('Server Running on port 3012');
        console.log('GraphQL: http://localhost:3012/graphql');
        console.log('Playground: http://localhost:3012/playground');
    });
});
