import 'dotenv/config'
import { app, bootstrap } from './app'

bootstrap().then(() => {
  app.listen(3012, () => {
    console.log('Server Running on port 3012')
    console.log('GraphQL: http://localhost:3012/graphql')
    console.log('Playground: http://localhost:3012/playground')
  })
})
