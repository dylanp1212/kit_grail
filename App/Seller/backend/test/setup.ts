import {beforeAll, afterAll, afterEach} from 'vitest'

import * as http from 'http'
import app from '../src/app'
import {mswServer} from './mswServer'

export let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>

beforeAll(() => {
  mswServer.listen({onUnhandledRequest: 'bypass'})
  server = http.createServer(app)
  server.listen()
})

afterEach(() => {
  mswServer.resetHandlers()
})

afterAll(() => {
  mswServer.close()
  server.close()
})