import 'dotenv/config'
import { app, bootstrap } from './app'

bootstrap().then(() => {
  app.listen(3015, () => {
    console.log('Server Running on port 3015')
    console.log('GraphQL: http://localhost:3015/graphql')
    console.log('Playground: http://localhost:3015/playground')
  })
})
