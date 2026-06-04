import { SessionUser } from '../../auth'

declare global {
  namespace Express {
    export interface Request {
      user: SessionUser
    }
  }
}
