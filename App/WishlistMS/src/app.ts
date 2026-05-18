import 'reflect-metadata'
import path from 'path'
import express, { Express } from 'express'
import cors from 'cors'
import { buildSchema, AuthChecker } from 'type-graphql'
import { createHandler } from 'graphql-http/lib/use/express'

import { resolvers } from './resolver'

const app: Express = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const authChecker: AuthChecker = () => true

async function bootstrap() {
  const schema = await buildSchema({
    resolvers,
    validate: false,
    authChecker,
    emitSchemaFile: {
      path: path.resolve(__dirname, '../build/schema.gql'),
      sortedSchema: true,
    },
  })

  app.use(
    '/graphql',
    createHandler({
      schema,
      context: (req) => ({ headers: req.headers }),
    })
  )

  app.get('/playground', (_req, res) => {
    res.send(`<!DOCTYPE html>
<html>
<head>
  <title>GraphiQL</title>
  <link href="https://unpkg.com/graphiql/graphiql.min.css" rel="stylesheet" />
</head>
<body style="margin: 0;">
  <div id="graphiql" style="height: 100vh;"></div>
  <script src="https://unpkg.com/react/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/graphiql/graphiql.min.js"></script>
  <script>
    const root = ReactDOM.createRoot(document.getElementById('graphiql'));
    root.render(React.createElement(GraphiQL, {
      fetcher: GraphiQL.createFetcher({ url: '/graphql' })
    }));
  </script>
</body>
</html>`)
  })
}

export { app, bootstrap }
export default app
