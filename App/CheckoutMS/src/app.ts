import express, {
  Express,
  Router,
  Response as ExResponse,
  Request as ExRequest,
  ErrorRequestHandler,
  NextFunction
} from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'

import {RegisterRoutes} from '../build/routes'
import {webhookHandler} from './checkout/webhook'

const app: Express = express()
app.use(cors())
app.post('/api/v0/checkout/webhook', express.raw({type: 'application/json'}), webhookHandler)
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/v0/docs', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  res.send(
    swaggerUi.generateHTML(await import('../build/swagger.json'))
  )
})

const router = Router()
RegisterRoutes(router)
app.use('/api/v0', router)

const errorHandler: ErrorRequestHandler = (err, _req, res, _next: NextFunction) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  })
  _next()
}
app.use(errorHandler)

export default app
