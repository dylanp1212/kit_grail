import express, {
  Express,
  Router,
  Response as ExResponse,
  Request as ExRequest,
  ErrorRequestHandler ,
  NextFunction
} from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'

import { authRouter } from './auth/router'
import { requireSellerAuth } from './auth/middleware'
import {RegisterRoutes} from "../build/routes"

const app: Express = express()
app.use(cors({ credentials: true, origin: true }))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.use('/api/v0/docs', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  res.send(
    swaggerUi.generateHTML(await import('../build/swagger.json'))
  )
})

app.use('/api/v0/auth', authRouter)
app.use('/api/auth', authRouter)

const router = Router()
router.use(requireSellerAuth)
RegisterRoutes(router)
app.use('/api/v0', router)

app.use((_req, _res, next) => {
  const err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next: NextFunction) => {
  console.log('err:', err);
  res.status(err.status).json( {
    message: err.message,
    errors: err.errors,
    status: err.status,
  })
  _next()
}
app.use(errorHandler)

export default app