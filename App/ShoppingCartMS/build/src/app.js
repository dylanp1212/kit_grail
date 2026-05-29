"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
exports.bootstrap = bootstrap;
require("reflect-metadata");
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const type_graphql_1 = require("type-graphql");
const express_2 = require("graphql-http/lib/use/express");
const resolver_1 = require("./resolver");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const authChecker = () => true;
async function bootstrap() {
    const schema = await (0, type_graphql_1.buildSchema)({
        resolvers: resolver_1.resolvers,
        validate: false,
        authChecker,
        emitSchemaFile: {
            path: path_1.default.resolve(__dirname, '../build/schema.gql'),
            sortedSchema: true,
        },
    });
    app.use('/graphql', (0, express_2.createHandler)({
        schema,
        context: (req) => ({ headers: req.headers }),
    }));
    app.get('/playground', (_req, res) => {
        res.send(`<!DOCTYPE html>
<html>
<head>
  <title>GraphiQL</title>
  <link href="https://unpkg.com/graphiql@2.4.0/graphiql.min.css" rel="stylesheet" />
</head>
<body style="margin: 0;">
  <div id="graphiql" style="height: 100vh;"></div>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/graphiql@2.4.0/graphiql.min.js"></script>
  <script>
    const root = ReactDOM.createRoot(document.getElementById('graphiql'));
    root.render(React.createElement(GraphiQL, {
      fetcher: GraphiQL.createFetcher({ url: '/graphql' })
    }));
  </script>
</body>
</html>`);
    });
}
exports.default = app;
